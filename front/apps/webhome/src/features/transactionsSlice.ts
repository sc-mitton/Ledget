
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { apiSlice } from '@api/apiSlice'
import { Category, extendedApiSlice as extendedCategoryApiSlice } from '@features/categorySlice'
import type { Bill } from '@features/billSlice'
import { extendedApiSlice as extendedBillApiSlice } from '@features/billSlice'

export type AccountType = 'depository' | 'credit' | 'loan' | 'investment' | 'other'

export type Transaction = {
    account: string
    transaction_id: string
    transaction_code?: string
    transaction_type?: string
    category?: Category,
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
    datetime?: string
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
    month?: number
    offset?: number
    limit?: number
}

interface GetTransactionsResponse {
    results: Transaction[]
    next?: number
    previous?: number
}

interface TransactionsSyncResponse {
    added: number
    modified: number
    removed: number
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
        getTransactions: builder.query<GetTransactionsResponse, GetTransactionsParams>({
            query: (params) => ({
                url: 'transactions',
                params: params,
                providesTags: (result: GetTransactionsResponse) => {
                    result
                        ? [...result.results.map(transaction_id => ({ type: 'Transactions', id: transaction_id })), 'Transactions']
                        : ['Transactions']
                }
            }),
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
        updateTransactions: builder.mutation<Transaction[], Transaction[]>({
            query: (data) => ({
                url: 'transactions',
                method: 'POST',
                body: data,
                invalidatesTags: [
                    ...data.map(transaction => ({ type: 'Transactions', id: transaction.transaction_id })),
                    'Categories',
                    'Bills'
                ]
            }),
        }),
    }),
})

interface ConfirmItem {
    transaction_id: string
    category?: string
    bill?: string
}

export const confirmedQueueSlice = createSlice({
    name: 'confirmedQueue',
    initialState: [] as ConfirmItem[],
    reducers: {
        pushConfirmedTransaction: (
            state,
            action: PayloadAction<ConfirmItem>) => {
            state.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            extendedCategoryApiSlice.endpoints.getCategories.matchFulfilled,
            (state, action) => {
                state.splice(0, state.length)
            }
        ),
            builder.addMatcher(
                extendedBillApiSlice.endpoints.getBills.matchFulfilled,
                (state, action) => {
                    state.splice(0, state.length)
                }
            )
    }
})

export const {
    pushConfirmedTransaction
} = confirmedQueueSlice.actions

export const selectConfirmedQueue = (state: { confirmedQueue: Transaction[] }) => state.confirmedQueue
export const selectConfirmedQueueLength = (state: { confirmedQueue: Transaction[] }) => state.confirmedQueue.length

export const {
    useTransactionsSyncMutation,
    useGetTransactionsQuery,
    useLazyGetTransactionsQuery,
    useUpdateTransactionsMutation
} = extendedApiSlice

export const useGetTransactionQueryState = extendedApiSlice.endpoints.getTransactions.useQueryState
