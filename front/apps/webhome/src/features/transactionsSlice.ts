
import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '@api/apiSlice'
import { Category, addTransaction2Cat, SplitCategory } from '@features/categorySlice'
import { addTransaction2Bill } from '@features/billSlice'
import type { Bill } from '@features/billSlice'
import type { RootState } from './store'

export type AccountType = 'depository' | 'credit' | 'loan' | 'investment' | 'other'

export type Transaction = {
    account: string
    transaction_id: string
    transaction_code?: string
    transaction_type?: string
    categories?: Category[],
    bill?: Bill,
    predicted_category?: Category,
    predicted_bill?: Bill,
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
}

export interface GetTransactionsParams {
    type?: AccountType
    account?: string
    confirmed?: boolean
    start?: number
    end?: number
    offset?: number
    limit?: number
}

interface GetTransactionsResponse {
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

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        transactionsSync: builder.mutation<TransactionsSyncResponse, { account: string } | { item: string }>({
            query: (params) => ({
                url: 'transactions/sync',
                params: params,
                method: 'POST',
                invalidatesTags: ['Transactions']
            }),
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
            transformResponse: (response: any) => {
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
            providesTags: ['Transaction'],
            // For merging in paginated responses to the cache
            // cache key needs to not include offset and limit
            serializeQueryArgs: ({ queryArgs }) => {
                const { offset, limit, ...cacheKeyArgs } = queryArgs
                return cacheKeyArgs
            },
            merge: (currentCache, newItems) => {
                if (currentCache.results) {
                    const { results } = currentCache
                    const { results: newResults, ...newRest } = newItems
                    return {
                        results: [...results, ...newResults],
                        ...newRest
                    }
                }
                return currentCache
            },
            transformResponse: (response: any) => {
                // If response is a list
                if (Array.isArray(response)) {
                    return { results: response }
                } else {
                    return response
                }
            },
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),
        updateTransactions: builder.mutation<any, ConfirmedQueue>({
            query: (data) => ({
                url: 'transactions',
                method: 'POST',
                body: data.map(item => ({
                    transaction_id: item.transaction.transaction_id,
                    categories: item.categories?.map(item => ({ id: item.id, fraction: item.fraction })),
                    bill: item.bill
                })),
            }),
            invalidatesTags: ['Transaction', 'Category', 'Bill']
        }),
    }),
})

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
            extendedApiSlice.endpoints.updateTransactions.matchFulfilled,
            (state, action) => {
                // When updates are sent to the server we can clear the confirmed queue
                state.confirmedQue.splice(0, state.confirmedQue.length)
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
            for (const { id, fraction } of categories) {
                dispatch(addTransaction2Cat({ categoryId: id, amount: transaction.amount * fraction }));
            }
        } else if (bill) {
            dispatch(addTransaction2Bill({ billId: bill, amount: transaction.amount }));
        }
    }
)

export const { confirmTransaction, removeUnconfirmedTransaction } = confirmStack.actions

const selectUnconfirmed = (state: RootState) => state.confirmStack.unconfirmed
const selectConfirmedQue = (state: RootState) => state.confirmStack.confirmedQue
const selectDateYear = (state: RootState, date: { year: number, month: number }) => date

export const selectUnconfirmedTransactions = createSelector(
    [selectUnconfirmed, selectDateYear],
    (unconfirmed, date) => unconfirmed.filter(item => {
        const itemDate = new Date(item.datetime)
        return itemDate.getFullYear() === date.year && itemDate.getMonth() + 1 === date.month
    })
)

export const selectConfirmedTransactions = createSelector(
    [selectConfirmedQue, selectDateYear],
    (confirmedQue, date) => confirmedQue.filter(item => {
        const itemDate = new Date(item.transaction.datetime)
        return itemDate.getFullYear() === date.year && itemDate.getMonth() + 1 === date.month
    })
)

export const selectUnconfirmedLength = createSelector(
    [selectUnconfirmed, selectDateYear],
    (unconfirmed, date) => unconfirmed.reduce((acc, item) => {
        const itemDate = new Date(item.datetime)
        if (itemDate.getFullYear() === date.year && itemDate.getMonth() + 1 === date.month) {
            return acc + 1
        }
        return acc
    }, 0)
)

export const {
    useTransactionsSyncMutation,
    useGetTransactionsQuery,
    useLazyGetTransactionsQuery,
    useLazyGetUnconfirmedTransactionsQuery,
    useUpdateTransactionsMutation,
} = extendedApiSlice

export const useGetTransactionQueryState = extendedApiSlice.endpoints.getTransactions.useQueryState
