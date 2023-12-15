import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie';

export const apiSlice = createApi({
    reducerPath: 'ledget',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_LEDGET_API_URI,
        credentials: 'include',
        prepareHeaders: async (headers, { extra }) => {
            // Set http_x_csrftoken header from the cookies
            const csrftoken = Cookies.get('csrftoken') || ''
            if (csrftoken) {
                headers.set('X-CsrfToken', csrftoken)
            }

            return headers
        },
    }),
    tagTypes: [
        'Transaction',
        'Bill',
        'Category',
        'UnconfirmedTransaction',
        'Account',
        'SpendingHistory',
        'Device',
        'User',
    ],
    endpoints: (builder) => ({}),
})
