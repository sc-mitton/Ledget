import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ledgetSlice = createApi({
    reducerPath: 'ledget',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => 'user/me',
        }),
        getPaymentMethod: builder.query({
            query: () => 'payment_methods',
            keepUnusedDataFor: 180,
        }),
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
        addNewCategory: builder.mutation({
            query: ({ data }) => ({
                url: 'category',
                method: 'POST',
                body: data,
            }),
        }),
        addnewBill: builder.mutation({
            query: ({ data }) => ({
                url: 'bill',
                method: 'POST',
                body: data,
            }),
        })
    })
})

export const {
    useGetMeQuery,
    useGetPlaidTokenQuery,
    useGetPaymentMethodQuery,
    useGetPlaidItemsQuery,
    useAddNewCategoryMutation,
    useAddnewBillMutation,
    useAddNewPlaidItemMutation,
    useDeletePlaidItemMutation,
} = ledgetSlice
