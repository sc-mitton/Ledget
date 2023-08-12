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
        getPlaidToken: builder.query({
            query: () => 'plaid_link_token',
        }),
        getPaymentMethod: builder.query({
            query: (userId) => `user/${userId}/payment_method`,
        }),
        addNewPlaidItem: builder.mutation({
            query: ({ data, userId }) => ({
                url: `user/${userId}/plaid_token_exchange`,
                method: 'POST',
                body: data,
            }),
        }),
        addNewCategory: builder.mutation({
            query: ({ data, userId }) => ({
                url: `user/${userId}/category`,
                method: 'POST',
                body: data,
            }),
        }),
        addnewBill: builder.mutation({
            query: ({ data, userId }) => ({
                url: `user/${userId}/bill`,
                method: 'POST',
                body: data,
            }),
        }),
    })
})

export const {
    useGetMeQuery,
    useGetPlaidTokenQuery,
    useGetPaymentMethodQuery,
    useAddNewCategoryMutation,
    useAddnewBillMutation,
    useAddNewPlaidItemMutation,
} = ledgetSlice
