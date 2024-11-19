import { createSlice } from '@reduxjs/toolkit';
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
  TransformedInvestmentsBalanceHistory
} from './types';

const investmentsRTKSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInvestments: build.query<InvestmentsResponse, GetInvestmentsQuery>({
      query: () => 'investments',
      providesTags: ['Investment'],
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
            ...newRest
          };
        } else if (currentCache.results) {
          return newItems;
        }
        return currentCache;
      }
    }),
    getInvestmentsBalanceHistory: build.query<TransformedInvestmentsBalanceHistory, InvestmentsBalanceQuery>({
      query: (params) => ({
        url: 'investments/balance-history',
        method: 'GET',
        params
      }),
      transformResponse: (response: InvestmentsBalanceHistory) => {
        return response.map((r) => ({
          ...r,
          balances: r.balances.map((b) => ({ ...b, value: parseFloat(b.value) }))
        }));
      },
      providesTags: ['InvestmentBalanceHistory'],
    }),
  }),
});


const initialInvestmentsState: InvestmentsState = {
  holdingsHistory: {} as { [key: string]: { institution_value: number, date: string }[] },
}

export const investmentsSlice = createSlice({
  name: 'investments',
  initialState: initialInvestmentsState,
  reducers: {
    setSecurities: (state, action) => { }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      investmentsRTKSlice.endpoints.getInvestments.matchFulfilled,
      (state, action) => {
        const holdings = action.payload.results.reduce((acc, i) => {
          if (isInvestmentSupported(i)) {
            return acc.concat(i.holdings)
          }
          return acc
        }, [] as InvestmentWithProductSupport['holdings'])
        for (const holding of holdings) {
          if (!holding.security_id || !holding.institution_value) {
            continue
          }
          if (!state.holdingsHistory[holding.security_id]) {
            state.holdingsHistory[holding.security_id] = []
          }
          const latestDate = state.holdingsHistory[holding.security_id]?.[state.holdingsHistory[holding.security_id].length - 1]?.date
          if (!latestDate || dayjs(latestDate).isBefore(dayjs(), 'day')) {
            state.holdingsHistory[holding.security_id].push({
              institution_value: holding.institution_value,
              date: dayjs().format('YYYY-MM-DD')
            })

            // Trim the history to the last 2 entries to save memory
            state.holdingsHistory[holding.security_id] = state.holdingsHistory[holding.security_id].slice(
              state.holdingsHistory[holding.security_id].length - 2,
              state.holdingsHistory[holding.security_id].length
            )
          }
        }
      }
    )
  }
})

export const selectTrackedHoldings = (state: { investments: InvestmentsState }) => state.investments.holdingsHistory

export const {
  useGetInvestmentsQuery,
  useLazyGetInvestmentsQuery,
  useGetInvestmentsBalanceHistoryQuery,
  useLazyGetInvestmentsBalanceHistoryQuery
} = investmentsRTKSlice;
