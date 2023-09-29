import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlaidToken: builder.query({
            query: ({ isOnboarding }) => ({
                url: `plaid_link_token${isOnboarding ? '?is_onboarding=true' : ''}`,
            }),
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
        updatePlaidItem: builder.mutation({
            query: ({ plaidItemId, data }) => ({
                url: `/plaid_item/${plaidItemId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['PlaidItem'],
        }),
    })
})

export const {
    useLazyGetPlaidTokenQuery,
    useGetPlaidItemsQuery,
    useAddNewPlaidItemMutation,
    useDeletePlaidItemMutation,
    useUpdatePlaidItemMutation,
} = extendedApiSlice
