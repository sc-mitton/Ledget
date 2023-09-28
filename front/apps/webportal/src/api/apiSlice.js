import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'ledget',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_LEDGET_API_URI,
        credentials: 'include',
    }),
    endpoints: (builder) => ({}),
})
