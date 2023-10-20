import { apiSlice } from '@api/apiSlice'

interface Account {
    account: string
    order: number
    [key: string]: any
}

const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ['Accounts'] })


export const accountsSlice = apiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        getAccounts: builder.query<any, void>({
            query: () => `/accounts`,
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),
        updateAccounts: builder.mutation<any, Account[]>({
            query: (data) => ({
                url: `/accounts`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Accounts'],
        }),
    }),
})

export const { useGetAccountsQuery, useUpdateAccountsMutation } = accountsSlice

export const useGetAccountsQueryState = accountsSlice.endpoints.getAccounts.useQueryState
