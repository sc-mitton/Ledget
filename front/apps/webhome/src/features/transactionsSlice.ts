import { apiSlice } from '@api/apiSlice'
import { current } from '@reduxjs/toolkit'

export type accountType = 'depository' | 'credit' | 'loan' | 'investment' | 'other'
interface getTransactionsParams {
    type: accountType
    account: string
    offset?: number
    limit?: number
}

interface TransactionsResponse {
    results: any[]
    next?: string
    previous?: string
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        transactionsSync: builder.mutation<any, string>({
            query: (itemId) => ({
                url: 'transactions/sync',
                params: { item: itemId },
                method: 'POST',
                invalidatesTags: ['transactions']
            }),
        }),
        getTransactions: builder.query<TransactionsResponse, getTransactionsParams>({
            query: (params) => ({
                url: 'transactions',
                params: params,
                providesTags: ['transactions'],
            }),
            serializeQueryArgs: ({ queryArgs }) => {
                const { offset, limit, ...cacheKeyArgs } = queryArgs
                return cacheKeyArgs
            },
            merge: (currentCache, newItems) => {
                if (currentCache.results) {
                    const { results, ...rest } = currentCache
                    return {
                        results: [...currentCache.results, ...newItems.results],
                        ...rest
                    }
                }
                return currentCache
            },
            keepUnusedDataFor: 60 * 15, // 15 minutes
        })
    }),
})

export const {
    useTransactionsSyncMutation,
    useGetTransactionsQuery,
    useLazyGetTransactionsQuery
} = extendedApiSlice

export const useGetTransactionQueryState = extendedApiSlice.endpoints.getTransactions.useQueryState
