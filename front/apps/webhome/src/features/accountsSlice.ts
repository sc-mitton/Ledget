import { apiSlice } from '@api/apiSlice'

export type AccountType = 'depository' | 'credit' | 'loan' | 'investment' | 'other'

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
    official_name?: string
    type: AccountType
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

interface GetAccountBalanceHistoryParams {
    start: number
    end: number
    type: 'depository' | 'investment'
    accounts?: string[]
}

interface GetAccountBalanceTrendParams extends Omit<GetAccountBalanceHistoryParams, 'start' | 'end'> {
    days?: number
}

type BalanceTrend = {
    trend: number
    date: string
    account: string
}

type AccountBalance = {
    account_id: string
    history: {
        month: string
        balance: number
    }[]
}

type GetAccountBalanceTrendResponse = {
    days: number
    trends: BalanceTrend[]
}

type GetBalanceHistoryResponse = AccountBalance[]

const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ['Accounts'] })

export const accountsSlice = apiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        getAccounts: builder.query<GetAccountsResponse, void>({
            query: () => `/accounts`,
            keepUnusedDataFor: 60 * 30, // 30 minutes
            providesTags: ['Account'],
        }),
        getAccountBalanceHistory: builder.query<GetBalanceHistoryResponse, GetAccountBalanceHistoryParams | void>({
            query: (params) => {
                const { accounts, ...rest } = params || {}
                const queryObj = {
                    url: `/accounts/balance-history${accounts ? `?account=${accounts.join('&account=')}` : ''}`,
                    method: 'GET',
                }
                return rest ? { ...queryObj, params: rest } : queryObj
            },
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),
        getAccountBalanceTrend: builder.query<GetAccountBalanceTrendResponse, GetAccountBalanceTrendParams>({
            query: (params) => {
                const { accounts, ...rest } = params || {}
                const queryObj = {
                    url: `/accounts/balance-trend${accounts ? `?account=${accounts.join('&account=')}` : ''}`,
                    method: 'GET',
                }
                return rest ? { ...queryObj, params: rest } : queryObj
            },
            keepUnusedDataFor: 60 * 30, // 30 minutes
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

export const {
    useGetAccountsQuery,
    useUpdateAccountsMutation,
    useLazyGetAccountBalanceHistoryQuery,
    useLazyGetAccountBalanceTrendQuery,
} = accountsSlice

export const useGetAccountsQueryState = accountsSlice.endpoints.getAccounts.useQueryState
