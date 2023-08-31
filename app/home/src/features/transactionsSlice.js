import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        transactionsSync: builder.mutation({
            query: (itemId) => ({
                url: 'transactions/sync',
                method: 'POST',
                body: { item_id: itemId },
            }),
        }),
        addNewTransaction: builder.mutation({
            query: ({ data }) => ({
                url: 'transaction',
                method: 'POST',
                body: data,
            }),
        })
    }),
})


export const {
    useTransactionsSyncMutation,
    useAddNewTransactionMutation
} = extendedApiSlice
