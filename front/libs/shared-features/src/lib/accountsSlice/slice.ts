import apiSlice from '../apiSlice/slice';
import {
  GetAccountBalanceHistoryParams,
  GetAccountBalanceTrendParams,
  GetAccountsResponse,
  GetBalanceHistoryResponse,
  GetAccountBalanceTrendResponse,
  UpdateAccount
} from './types';

const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ['Accounts'] });

export const accountsSlice = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<GetAccountsResponse, void>({
      query: () => `accounts`,
      keepUnusedDataFor: 60 * 30, // 30 minutes
      providesTags: ['Account']
    }),
    getAccountBalanceHistory: builder.query<
      GetBalanceHistoryResponse,
      GetAccountBalanceHistoryParams | void
    >({
      query: (params) => {
        const { accounts, ...rest } = params || {};
        const queryObj = {
          url: `accounts/balance-history${accounts ? `?account=${accounts.join('&account=')}` : ''
            }`,
          method: 'GET'
        };
        return rest ? { ...queryObj, params: rest } : queryObj;
      },
      keepUnusedDataFor: 60 * 30 // 30 minutes
    }),
    getAccountBalanceTrend: builder.query<
      GetAccountBalanceTrendResponse,
      GetAccountBalanceTrendParams
    >({
      query: (params) => {
        const { accounts, ...rest } = params || {};
        const queryObj = {
          url: `accounts/balance-trend${accounts ? `?account=${accounts.join('&account=')}` : ''
            }`,
          method: 'GET'
        };
        return rest ? { ...queryObj, params: rest } : queryObj;
      },
      keepUnusedDataFor: 60 * 30 // 30 minutes
    }),
    updateAccounts: builder.mutation<UpdateAccount[], UpdateAccount[]>({
      query: (data) => ({
        url: `accounts`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Account']
    })
  })
});

export const {
  useGetAccountsQuery,
  useUpdateAccountsMutation,
  useLazyGetAccountBalanceHistoryQuery,
  useLazyGetAccountBalanceTrendQuery
} = accountsSlice;

export const useGetAccountsQueryState =
  accountsSlice.endpoints.getAccounts.useQueryState;
