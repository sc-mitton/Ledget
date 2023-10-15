import { apiSlice } from '@api/apiSlice'

export type accountType = 'depository' | 'credit' | 'loan' | 'investment' | 'other'
interface getTransactionsParams {
    type: accountType
    account: string
    cursor?: string
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
        getTransactions: builder.query<any, getTransactionsParams>({
            query: (params) => ({
                url: 'transactions',
                params: params,
                providesTags: ['transactions'],
            }),
            keepUnusedDataFor: 60 * 15, // 15 minutes
        })
    }),
})

export const {
    useTransactionsSyncMutation,
    useGetTransactionsQuery
} = extendedApiSlice

export const useGetTransactionQueryState = extendedApiSlice.endpoints.getTransactions.useQueryState
