import { apiSlice } from '@api/apiSlice'

export const accountsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccounts: builder.query({
            query: () => `/accounts`,
            keepUnusedDataFor: 60 * 30 // 30 minutes
        }),
    }),
})

export const { useGetAccountsQuery } = accountsSlice
