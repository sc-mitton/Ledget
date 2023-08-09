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
    })
})

export const { useGetMeQuery, useGetPlaidTokenQuery } = ledgetSlice
