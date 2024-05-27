
import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '@api/apiSlice'
import { Category, SplitCategory } from '@features/categorySlice'
import { TransactionFilterSchema } from 'src/app/header/activity/history/Filter'
import { addTransaction2Cat, addTransaction2Bill } from '@features/budgetItemMetaDataSlice'
import type { Bill } from '@features/billSlice'
import type { AccountType } from '@features/accountsSlice'
import type { RootState } from './store'
import type { DeepPartial } from '@utils/types'

export type Note = {
    id: string
    datetime: string
    text: string
    is_current_users: boolean
}

export type Transaction = {
    account: string
    transaction_id: string
    transaction_code?: string
    transaction_type?: string
    categories?: SplitCategory[],
    bill?: Bill,
    predicted_category?: Category,
    predicted_bill?: Bill,
    is_spend?: boolean
    name: string
    preferred_name?: string
    merchant_name?: string
    payment_channel?: string
    pending?: boolean
    pending_transaction_id?: string
    amount: number
    iso_currency_code?: string
    unnoficial_currency_code?: string
    check_number?: string
    date: string
    datetime: string
    authorized_date?: string
    authorized_datetime?: string
    confirmed_date?: string
    confirmed_datetime?: string
    address?: string
    city?: string
    region?: string
    postal_code?: string
    country?: string
    lat?: number
    lon?: number
    store_number?: string
    notes: Note[]
}

export interface GetTransactionsParams {
    type?: AccountType
    account?: string
    confirmed?: boolean
    start?: number
    end?: number
    month?: number
    year?: number
    limit_amount_lower?: string | number
    limit_amount_upper?: string | number
    items?: string[]
    merchants?: string[]
    accounts?: string[]
    category?: string

    // Pagination query params
    limit?: number
    offset?: number
}

export type GetTransactionsResponse = {
    results: Transaction[]
    next?: number
    previous?: number
    limit?: number
}

interface TransactionsSyncResponse {
    added: number
    modified: number
    removed: number
}

interface SimpleTransaction {
    transaction: Transaction
    categories?: SplitCategory[]
    bill?: string
}

export interface QueueItemWithBill extends SimpleTransaction {
    categories?: never
    bill: string
}

export interface QueueItemWithCategory extends SimpleTransaction {
    categories?: SplitCategory[]
    bill?: never
}

export type ConfirmedQueue = (QueueItemWithBill | QueueItemWithCategory)[];

interface ConfirmStackInitialState extends ConfirmedQueue {
    unconfirmed: Transaction[];
    confirmedQue: ConfirmedQueue;
}

type ConfirmTransactionParams = {
    transaction_id: Transaction['transaction_id']
    splits?: { category: SplitCategory['id'], fraction: SplitCategory['fraction'] }[]
    bill?: Bill['id']
}[]

// RTK slice

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        transactionsSync: builder.mutation<TransactionsSyncResponse, { account?: string } | { item?: string }>({
            query: (params) => ({
                url: 'transactions/sync',
                params: params,
                method: 'POST',
            }),
            invalidatesTags: (result, error, arg) => {
                if (!result) {
                    return []
                } else if (result.added > 0 || result.modified > 0 || result.removed > 0) {
                    return [
                        { type: 'Transaction', id: 'LIST' },
                        { type: 'UnconfirmedTransaction', id: 'LIST' },
                    ]
                } else {
                    return []
                }
            }
        }),
        getUnconfirmedTransactions: builder.query<GetTransactionsResponse, GetTransactionsParams>({
            query: (params) => ({
                url: 'transactions',
                params: { ...params, confirmed: false },
            }),
            providesTags: ['UnconfirmedTransaction'],
            // For merging in paginated responses to the cache
            // cache key needs to not include offset and limit
            serializeQueryArgs: ({ queryArgs }) => {
                const { offset, limit, ...cacheKeyArgs } = queryArgs
                return cacheKeyArgs
            },
            merge: (currentCache, newItems) => {
                if (currentCache.next) {
                    const { results } = currentCache
                    const { results: newResults, ...newRest } = newItems
                    return {
                        results: [...results, ...newResults],
                        ...newRest
                    }
                } else if (currentCache.results) {
                    return newItems
                }
                return currentCache
            },
            transformResponse: (response: Transaction[] | GetTransactionsResponse) => {
                // If response is a list
                if (Array.isArray(response)) {
                    return { results: response }
                } else {
                    return response
                }
            },
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),
        getTransactions: builder.query<GetTransactionsResponse, GetTransactionsParams>({
            query: (params) => ({
                url: 'transactions',
                params: params,
            }),
            providesTags: (result, error, arg) => {
                return result
                    ? result.results.map(item => ({ type: 'Transaction', id: item.transaction_id }))
                    : [{ type: 'Transaction', id: 'LIST' } as const]
            },
            // For merging in paginated responses to the cache
            // cache key needs to not include offset and limit
            serializeQueryArgs: ({ queryArgs }) => {
                const { offset, limit, ...cacheKeyArgs } = queryArgs
                return cacheKeyArgs
            },
            merge: (currentCache, newItems) => {
                if (currentCache.results) {
                    const { results } = currentCache
                    const { results: newResults } = newItems
                    // dedupe
                    return {
                        results: [
                            ...results.filter(item =>
                                !newResults.find(i => i.transaction_id === item.transaction_id)),
                            ...newResults.map(t => ({ ...t, amount: 100 })),
                        ],
                    }
                }
                return currentCache
            },
            transformResponse: (response: Transaction[] | GetTransactionsResponse) => {
                // If response is a list
                if (Array.isArray(response)) {
                    return { results: response }
                } else {
                    return response
                }
            },
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),
        getTransactionsCount: builder.query<{ count: number }, GetTransactionsParams>({
            query: (params) => ({
                url: 'transactions/count',
                params: params,
                providesTags: ['TransactionCount']
            }),
        }),
        getMerchants: builder.query<string[], void>({
            query: () => ({
                url: 'transactions/merchants',
                params: {},
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),
        confirmTransactions: builder.mutation<any, ConfirmTransactionParams>({
            query: (data) => ({
                url: 'transactions/confirmation',
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, arg) => {
                const spendingHistoryTags: { readonly type: 'SpendingHistory', readonly id: string }[] = []
                arg.forEach(item => {
                    if (item.splits) {
                        item.splits.forEach(split => {
                            spendingHistoryTags.push({ type: 'SpendingHistory', id: split.category })
                        })
                    }
                })

                const otherTags = [
                    ...(arg.map(item => ({ type: 'Transaction', id: item.transaction_id } as const))),
                    ...(arg.some(item => item.splits) ? [{ type: 'Category', id: 'LIST' } as const] : []),
                    ...(arg.some(item => item.bill) ? [{ type: 'Bill', id: 'LIST' } as const] : [])
                ]
                return result
                    ? [...otherTags, ...spendingHistoryTags]
                    : otherTags
            }
        }),
        updateTransaction: builder.mutation<any, { transactionId: string, data: DeepPartial<Transaction> }>({
            query: ({ transactionId, data }) => ({
                url: `transactions/${transactionId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, arg) => ([{ type: 'Transaction', id: arg.transactionId } as const])
        }),
        addNote: builder.mutation<Note, { transactionId: string, text: string }>({
            query: ({ transactionId, text }) => ({
                url: `transactions/${transactionId}/note`,
                method: 'POST',
                body: { text },
            }),
            invalidatesTags: (result, error, arg) => ([{ type: 'Transaction', id: arg.transactionId } as const])
        }),
        updateDeleteNote: builder.mutation<any, { transactionId: string, noteId: string, text?: string }>({
            query: ({ transactionId, noteId, text }) => ({
                url: `transactions/${transactionId}/note/${noteId}`,
                method: text ? 'PUT' : 'DELETE',
                body: { text },
            }),
            invalidatesTags: (result, error, arg) => ([{ type: 'Transaction', id: arg.transactionId } as const])
        }),
    }),
})

// State Slices

export const confirmStack = createSlice({
    name: 'confirmStack',
    initialState: {
        unconfirmed: [] as Transaction[],
        confirmedQue: [] as ConfirmedQueue,
    } as ConfirmStackInitialState,
    reducers: {
        confirmTransaction: (
            state,
            action: PayloadAction<{ transaction: Transaction, categories?: SplitCategory[], bill?: string }>
        ) => {
            // const index = state.unconfirmed.findIndex(item => item.transaction_id === action.payload)
            const index = state.unconfirmed.findIndex(
                item => item.transaction_id === action.payload.transaction.transaction_id)

            if (index > -1) {
                if (action.payload.categories) {
                    state.confirmedQue.push({
                        transaction: state.unconfirmed[index],
                        categories: action.payload.categories
                    })
                } else if (action.payload.bill) {
                    state.confirmedQue.push({
                        transaction: state.unconfirmed[index],
                        bill: action.payload.bill
                    })
                }
                state.unconfirmed.splice(index, 1)
            }
        },
        removeUnconfirmedTransaction: (state, action: PayloadAction<string>) => {
            const index = state.unconfirmed.findIndex(item => item.transaction_id === action.payload)
            if (index > -1) {
                state.unconfirmed.splice(index, 1)
            }
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            extendedApiSlice.endpoints.getUnconfirmedTransactions.matchFulfilled,
            (state, action) => {
                // Add the action payload (query response) to the state
                // the query will only ever return items that are definitely not confirmed yet,
                // but might already be in the store, so we need to dedupe
                let currentIds: { [key: string]: boolean } = {}
                state.unconfirmed.forEach(item => currentIds[item.transaction_id] = true)
                state.unconfirmed = [
                    ...state.unconfirmed,
                    ...action.payload.results.filter(item => !currentIds[item.transaction_id])
                ]
            }
        ).addMatcher(
            extendedApiSlice.endpoints.confirmTransactions.matchFulfilled,
            (state, action) => {
                // When updates are sent to the server we can clear the confirmed queue
                state.confirmedQue.splice(0, state.confirmedQue.length)
            }
        )
    }
})

export const filteredFetchedConfirmedTransactions = createSlice({
    name: 'filteredFetchedonfirmedTransactions',
    initialState: {
        filtered: [],
        filter: {}
    } as { filtered: Transaction[], filter: TransactionFilterSchema },
    reducers: {
        setConfirmedTransactionFilter: (state, action: PayloadAction<TransactionFilterSchema>) => {
            state.filter = action.payload
        },
        clearConfirmedTransactionFilter: (state) => {
            state.filter = {}
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            extendedApiSlice.endpoints.getTransactions.matchFulfilled,
            (state, action) => {
                if (action.meta.arg.originalArgs.confirmed && !action.meta.arg.originalArgs.category) {
                    state.filtered = action.payload.results
                }
            }
        )
    }
})

// Confirm a single transaction and update the metadata
// for the bills and categories. The argument is an object
// with the transaction id and the confirmed categories/bills
export const confirmAndUpdateMetaData = createAsyncThunk(
    'confirmStack/confirmAndDispatch',
    async ({ transaction, categories, bill }:
        { transaction: Transaction, categories?: SplitCategory[] | undefined, bill?: string }, { dispatch }) => {
        dispatch(confirmStack.actions.confirmTransaction({ transaction, categories, bill }));

        if (categories && categories.length > 0) {
            for (const { id, fraction, period } of categories) {
                dispatch(addTransaction2Cat({ categoryId: id, amount: transaction.amount * fraction, period }));
            }
        } else if (bill) {
            dispatch(addTransaction2Bill({ billId: bill, amount: transaction.amount }));
        }
    }
)

// Actions and hooks
export const { confirmTransaction, removeUnconfirmedTransaction } = confirmStack.actions
export const { setConfirmedTransactionFilter, clearConfirmedTransactionFilter } = filteredFetchedConfirmedTransactions.actions

export const {
    useTransactionsSyncMutation,
    useGetTransactionsQuery,
    useLazyGetTransactionsQuery,
    useLazyGetUnconfirmedTransactionsQuery,
    useConfirmTransactionsMutation,
    useUpdateTransactionMutation,
    useAddNoteMutation,
    useUpdateDeleteNoteMutation,
    useGetMerchantsQuery,
    useGetTransactionsCountQuery,
} = extendedApiSlice

export const useGetTransactionQueryState = extendedApiSlice.endpoints.getTransactions.useQueryState


// Selectors
const selectUnconfirmed = (state: RootState) => state.confirmStack.unconfirmed
const selectConfirmedQue = (state: RootState) => state.confirmStack.confirmedQue
const selectDateYear = (state: RootState, date: { year: number, month: number }) => date
const selectMonthYear = (state: RootState, date: { year: number, month: number }) => date
export const selectFilteredFetchedConfirmedTransactions = (state: RootState) => state.filteredFetchedonfirmedTransactions.filtered
export const selectConfirmedTransactionFilter = (state: RootState) => state.filteredFetchedonfirmedTransactions.filter
export const selectConfirmedLength = (state: RootState) => state.confirmStack.confirmedQue.length

export const selectUnconfirmedTransactions = createSelector(
    [selectUnconfirmed, selectMonthYear],
    (unconfirmed, date) => unconfirmed.filter(item => {
        const itemDate = new Date(item.datetime || item.date)
        return itemDate.getUTCFullYear() === date.year && itemDate.getUTCMonth() + 1 === date.month
    })
)

export const selectConfirmedTransactions = createSelector(
    [selectConfirmedQue, selectDateYear],
    (confirmedQue, date) => confirmedQue.filter(item => {
        const itemDate = new Date(item.transaction.datetime || item.transaction.date)
        return itemDate.getUTCFullYear() === date.year && itemDate.getUTCMonth() + 1 === date.month
    })
)
