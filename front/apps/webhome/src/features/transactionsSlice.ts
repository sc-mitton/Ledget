import { apiSlice } from '@api/apiSlice'

type accountType = 'depository' | 'credit' | 'loan' | 'investment' | 'other'

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
        getTransactions: builder.query<any, accountType>({
            query: (accountType) => ({
                url: 'transactions',
                params: { account_type: accountType },
                providesTags: ['transactions'],
            }),
            keepUnusedDataFor: 60 * 15, // 15 minutes
        })
    }),
})

export const {
    useTransactionsSyncMutation,
    useGetTransactionsQuery,
} = extendedApiSlice
