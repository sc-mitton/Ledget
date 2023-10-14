import { apiSlice } from '@api/apiSlice'

type accountType = 'depository' | 'credit' | 'loan' | 'investment' | 'other'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        transactionsSync: builder.mutation<any, string>({
            query: (itemId) => ({
                url: 'transactions/sync',
                method: 'POST',
                body: { item_id: itemId },
            }),
        }),
        getTransactions: builder.query<any, accountType>({
            query: (accountType) => ({
                url: 'transactions',
                params: { account_type: accountType },
            }),
            keepUnusedDataFor: 60 * 15, // 15 minutes
        })
    }),
})


export const {
    useTransactionsSyncMutation,
    useGetTransactionsQuery,
} = extendedApiSlice
