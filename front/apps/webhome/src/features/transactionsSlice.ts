
import { createSlice } from '@reduxjs/toolkit'

import { apiSlice } from '@api/apiSlice'
import type { Category } from '@features/categorySlice'
import type { Bill } from '@features/billSlice'
import { create } from 'domain'

export type AccountType = 'depository' | 'credit' | 'loan' | 'investment' | 'other'

export type Transaction = {
    account: string
    transaction_id: string
    transaction_code?: string
    transaction_type?: string
    category?: Category,
    bill?: Bill,
    category_confirmed?: boolean
    bill_confirmed?: boolean
    wrong_predicted_category?: string
    wrong_predicted_bill?: string
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
    offset: number
    limit: number
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
        transactionsSync: builder.mutation<TransactionsSyncResponse, string>({
            query: (itemId) => ({
                url: 'transactions/sync',
                params: { item: itemId },
                method: 'POST',
                invalidatesTags: ['transactions']
            }),
        }),
        getTransactions: builder.query<GetTransactionsResponse, GetTransactionsParams>({
            query: (params) => ({
                url: 'transactions',
                params: params,
                providesTags: ['transactions'],
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
            keepUnusedDataFor: 60 * 30, // 15 minutes
        }),
        updateTransactions: builder.mutation<Transaction[], Transaction[]>({
            query: (data) => ({
                url: 'transactions',
                method: 'PATCH',
                body: data,
                invalidatesTags: ['transactions']
            }),
        }),
    }),
})

export const confirmedQueueSlice = createSlice({
    name: 'confirmedQueue',
    initialState: [] as Transaction[],
    reducers: {
        pushConfirmedTransaction: (state, action) => {
            state.push(action.payload)
        },
        clearConfirmedQueue: (state) => {
            state = []
        }
    }
})

export const {
    pushConfirmedTransaction,
    clearConfirmedQueue
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
