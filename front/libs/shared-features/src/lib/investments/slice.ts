import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import apiSlice from '../apiSlice/slice';
import {
  InvestmentsResponse,
  InvestmentsBalanceHistory,
  isInvestmentSupported,
  InvestmentWithProductSupport,
  InvestmentsState,
  GetInvestmentsQuery,
  InvestmentsBalanceQuery,
  TransformedInvestmentsBalanceHistory,
  PinnedHolding,
} from './types';

const investmentsRTKSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInvestments: build.query<InvestmentsResponse, GetInvestmentsQuery>({
      query: () => 'investments',
      providesTags: ['Investment'],
      keepUnusedDataFor: 60 * 30, // 30 minutes
      // For merging in paginated responses to the cache
      // cache key needs to not include offset and limit
      serializeQueryArgs: ({ queryArgs }) => {
        if (queryArgs) {
          const { cursor, ...cacheKeyArgs } = queryArgs;
          return cacheKeyArgs;
        } else {
          return 'getInvestments';
        }
      },
      merge: (currentCache, newItems) => {
        if (currentCache.cursor) {
          const { results } = currentCache;
          const { results: newResults, ...newRest } = newItems;
          return {
            results: [...results, ...newResults],
            ...newRest,
          };
        } else if (currentCache.results) {
          return newItems;
        }
        return currentCache;
      },
    }),
    getPinnedHoldings: build.query<{ id: string; security_id: string }[], void>(
      {
        query: (params) => ({
          url: 'holding-pin',
          method: 'GET',
        }),
      }
    ),
    getInvestmentsBalanceHistory: build.query<
      TransformedInvestmentsBalanceHistory,
      InvestmentsBalanceQuery
    >({
      query: (params) => ({
        url: 'investments/balance-history',
        method: 'GET',
        params,
      }),
      transformResponse: (response: InvestmentsBalanceHistory) => {
        return response
          .sort((a, b) => {
            if (a.account !== b.account) {
              return a.account.localeCompare(b.account) ? 0 : -1;
            } else {
              return dayjs(a.date).isBefore(b.date) ? -1 : 1;
            }
          })
          .reduce((acc, d) => {
            if (
              !acc[acc.length - 1] ||
              acc[acc.length - 1].account_id !== d.account
            ) {
              acc.push({
                account_id: d.account,
                balances: [],
              });
            }
            acc[acc.length - 1].balances.push({
              date: d.date,
              value: d.value,
            });
            return acc;
          }, [] as TransformedInvestmentsBalanceHistory);
      },
      keepUnusedDataFor: 60 * 30, // 30 minutes
      providesTags: ['InvestmentBalanceHistory'],
    }),
    pinHolding: build.mutation<{ id: string; security_id: string }, string>({
      query: (security_id) => ({
        url: 'holding-pin',
        method: 'POST',
      }),
    }),
    unPinHolding: build.mutation<void, string>({
      query: (security_id) => ({
        url: `holding-pin/${security_id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

const initialInvestmentsState: InvestmentsState = {
  holdingsHistory: {} as {
    [key: string]: { institution_value: number; date: string }[];
  },
  pinnedHoldings: [] as InvestmentsState['pinnedHoldings'],
};

export const investmentsSlice = createSlice({
  name: 'investments',
  initialState: initialInvestmentsState,
  reducers: {
    setSecurities: (state, action) => {},
    pinHolding: (
      state,
      action: PayloadAction<PinnedHolding['security_id']>
    ) => {
      state.pinnedHoldings = state.pinnedHoldings
        ? [{ security_id: action.payload, id: 'temp' }, ...state.pinnedHoldings]
        : [{ security_id: action.payload, id: 'temp' }];
    },
    unPinHolding: (
      state,
      action: PayloadAction<PinnedHolding['security_id']>
    ) => {
      state.pinnedHoldings = state.pinnedHoldings?.filter(
        (h) => h.security_id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      investmentsRTKSlice.endpoints.getInvestments.matchFulfilled,
      (state, action) => {
        const holdings = action.payload.results.reduce((acc, i) => {
          if (isInvestmentSupported(i)) {
            return acc.concat(i.holdings);
          }
          return acc;
        }, [] as InvestmentWithProductSupport['holdings']);
        for (const holding of holdings) {
          if (!holding.security_id || !holding.institution_value) {
            continue;
          }
          if (!state.holdingsHistory[holding.security_id]) {
            state.holdingsHistory[holding.security_id] = [];
          }
          const latestDate =
            state.holdingsHistory[holding.security_id]?.[
              state.holdingsHistory[holding.security_id].length - 1
            ]?.date;
          if (!latestDate || dayjs(latestDate).isBefore(dayjs(), 'day')) {
            state.holdingsHistory[holding.security_id].push({
              institution_value: holding.institution_value,
              date: dayjs().format('YYYY-MM-DD'),
            });

            // Trim the history to the last 2 entries to save memory
            state.holdingsHistory[holding.security_id] = state.holdingsHistory[
              holding.security_id
            ].slice(
              state.holdingsHistory[holding.security_id].length - 2,
              state.holdingsHistory[holding.security_id].length
            );
          }
        }
      }
    );
    builder.addMatcher(
      investmentsRTKSlice.endpoints.getPinnedHoldings.matchFulfilled,
      (state, action) => {
        state.pinnedHoldings = action.payload;
      }
    );
  },
});

export const selectTrackedHoldings = (state: {
  investments: InvestmentsState;
}) => state.investments.holdingsHistory;

export const selectPinnedHoldings = (state: {
  investments: InvestmentsState;
  [key: string]: any;
}) => state.investments.pinnedHoldings;

export const { pinHolding, unPinHolding } = investmentsSlice.actions;

export const {
  useGetInvestmentsQuery,
  useLazyGetInvestmentsQuery,
  useGetInvestmentsBalanceHistoryQuery,
  useLazyGetInvestmentsBalanceHistoryQuery,
  usePinHoldingMutation,
  useUnPinHoldingMutation,
} = investmentsRTKSlice;
