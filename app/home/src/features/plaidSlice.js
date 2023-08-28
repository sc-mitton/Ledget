import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlaidToken: builder.query({
            query: () => 'plaid_link_token',
        }),
        getPlaidItems: builder.query({
            query: () => 'plaid_items',
            providesTags: ['PlaidItem'],
        }),
        deletePlaidItem: builder.mutation({
            query: ({ plaidItemId }) => ({
                url: `/plaid_item/${plaidItemId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['PlaidItem'],
        }),
        addNewPlaidItem: builder.mutation({
            query: ({ data }) => ({
                url: 'plaid_token_exchange',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['PlaidItem'],
        }),
    })
})

export const {
    useGetPlaidTokenQuery,
    useGetPlaidItemsQuery,
    useAddNewPlaidItemMutation,
    useDeletePlaidItemMutation,
} = extendedApiSlice
