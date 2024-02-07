import { apiSlice } from '@api/apiSlice'

export interface Account {
    account_id: string
    balances: {
        available: number
        current: number
        limit: number
        iso_currency_code: string
    }
    unofficial_currency_code: string
    mask: string
    name: string
    official_name: string
    type: string
    subtype: string
    institution_id: string
}

export interface Institution {
    id: string
    name: string
    primary_color: string
    logo: string
    url: string
    oath: boolean
}

interface UpdateAccount {
    account: string
    order: number
    [key: string]: any
}

interface GetAccountsResponse {
    institutions: Institution[],
    accounts: Account[]
}

const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ['Accounts'] })


export const accountsSlice = apiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        getAccounts: builder.query<GetAccountsResponse, void>({
            query: () => `/accounts`,
            keepUnusedDataFor: 60 * 30, // 30 minutes
            providesTags: ['Account'],
        }),
        updateAccounts: builder.mutation<UpdateAccount[], UpdateAccount[]>({
            query: (data) => ({
                url: `/accounts`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Account'],
        }),
    }),
})

export const { useGetAccountsQuery, useUpdateAccountsMutation } = accountsSlice

export const useGetAccountsQueryState = accountsSlice.endpoints.getAccounts.useQueryState
