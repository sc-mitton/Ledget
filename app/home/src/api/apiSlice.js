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
    })
})

export const {
    useGetMeQuery,
    useGetPlaidTokenQuery,
    useGetPaymentMethodQuery,
} = ledgetSlice
