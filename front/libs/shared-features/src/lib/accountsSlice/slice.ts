import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import apiSlice from '../apiSlice/slice';
import {
  GetAccountBalanceHistoryParams,
  GetAccountBalanceTrendParams,
  GetAccountsResponse,
  GetBalanceHistoryResponse,
  GetAccountBalanceTrendResponse,
  UpdateAccount,
  GetBreakdownHistoryResponse,
} from './types';

const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ['Accounts'] });

export const accountsRTKSlice = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<GetAccountsResponse, void>({
      query: () => `accounts`,
      keepUnusedDataFor: 60 * 30, // 30 minutes
      providesTags: ['Account'],
    }),
    getBreakdownHistory: builder.query<GetBreakdownHistoryResponse, void>({
      query: () => `accounts/breakdown-history`,
      providesTags: ['AccountBreakdownHistory'],
      keepUnusedDataFor: 60 * 30, // 30 minutes
    }),
    getAccountBalanceHistory: builder.query<
      GetBalanceHistoryResponse,
      GetAccountBalanceHistoryParams | void
    >({
      query: (params) => {
        const { accounts, ...rest } = params || {};
        const queryObj = {
          url: `accounts/balance-history${
            accounts ? `?account=${accounts.join('&account=')}` : ''
          }`,
          method: 'GET',
        };
        return rest ? { ...queryObj, params: rest } : queryObj;
      },
      providesTags: ['AccountBalanceHistory'],
      keepUnusedDataFor: 60 * 30, // 30 minutes
    }),
    getAccountBalanceTrend: builder.query<
      GetAccountBalanceTrendResponse,
      GetAccountBalanceTrendParams
    >({
      query: (params) => {
        const { accounts, ...rest } = params || {};
        const queryObj = {
          url: `accounts/balance-trend${
            accounts ? `?account=${accounts.join('&account=')}` : ''
          }`,
          method: 'GET',
        };
        return rest ? { ...queryObj, params: rest } : queryObj;
      },
      providesTags: ['AccountBalanceTrend'],
      keepUnusedDataFor: 60 * 30, // 30 minutes
    }),
    updateAccounts: builder.mutation<UpdateAccount[], UpdateAccount[]>({
      query: (data) => ({
        url: 'accounts',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Account'],
    }),
  }),
});

type AccountsSliceStateT = string[];

const initialState: AccountsSliceStateT = [];

export const pinnedAccountsSlice = createSlice({
  name: 'pinnedAccounts',
  initialState,
  reducers: {
    setPinAccount: (state, action: PayloadAction<string>) => {
      state = state ? [action.payload, ...state] : [action.payload];
      return state;
    },
    unPinAccount: (state, action: PayloadAction<string>) => {
      state = state.filter((p) => p !== action.payload);
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      accountsRTKSlice.endpoints.getAccounts.matchFulfilled,
      (state, action) => {
        state = action.payload.accounts
          .filter((a) => a.type === 'depository')
          .filter((a) => a.pinned !== null)
          .sort((a, b) => (a.pinned! < b.pinned! ? -1 : 1))
          .map((a) => a.id);
        return state;
      }
    );
  },
});

export const {
  useGetAccountsQuery,
  useUpdateAccountsMutation,
  useLazyGetAccountBalanceHistoryQuery,
  useLazyGetAccountBalanceTrendQuery,
  useGetBreakdownHistoryQuery,
} = accountsRTKSlice;

export const useGetAccountsQueryState =
  accountsRTKSlice.endpoints.getAccounts.useQueryState;

export const { setPinAccount, unPinAccount } = pinnedAccountsSlice.actions;
export const selectPinnedAccounts = (state: {
  pinnedAccounts: AccountsSliceStateT;
  [key: string]: any;
}) => state.pinnedAccounts;
