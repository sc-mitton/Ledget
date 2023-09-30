import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlaidToken: builder.query({
            query: ({ isOnboarding, itemId }) => ({
                url: `plaid_link_token${isOnboarding ? '?is_onboarding=true' : ''}${itemId ? `/${itemId}` : ''}`,
            }),
            providesTags: ['PlaidToken'],
        }),
        getPlaidItems: builder.query({
            query: () => 'plaid_items',
            providesTags: ['PlaidItem'],
        }),
        deletePlaidItem: builder.mutation({
            query: ({ itemId }) => ({
                url: `/plaid_item/${itemId}`,
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
            query: ({ itemId, data }) => ({
                url: `/plaid_item/${itemId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['PlaidItem'],
        }),
    })
})

export const {
    useGetPlaidTokenQuery,
    useLazyGetPlaidTokenQuery,
    useGetPlaidItemsQuery,
    useAddNewPlaidItemMutation,
    useDeletePlaidItemMutation,
    useUpdatePlaidItemMutation,
} = extendedApiSlice
