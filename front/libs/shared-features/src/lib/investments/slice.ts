import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import apiSlice from '../apiSlice/slice';
import { Investments, InvestmentsBalanceHistory, isInvestmentSupported, InvestmentWithProductSupport } from './types';

const investmentsSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInvestments: build.query<Investments, { start: string, end: string } | void>({
      query: () => 'investments',
      providesTags: ['Investment'],
    }),
    getInvestmendsBalanceHistory: build.query<InvestmentsBalanceHistory, void>({
      query: () => 'investments/balance-history',
      providesTags: ['InvestmentBalanceHistory'],
    }),
  }),
});
export const { useGetInvestmentsQuery, useGetInvestmendsBalanceHistoryQuery } = investmentsSlice;


const initialSecuritiesState = {} as { [key: string]: { institution_value: number, date: string }[] }

export const holdingsSlice = createSlice({
  name: 'holdings',
  initialState: initialSecuritiesState,
  reducers: {
    setSecurities: (state, action) => { }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      investmentsSlice.endpoints.getInvestments.matchFulfilled,
      (state, action) => {
        const holdings = action.payload.reduce((acc, i) => {
          if (isInvestmentSupported(i)) {
            return acc.concat(i.holdings)
          }
          return acc
        }, [] as InvestmentWithProductSupport['holdings'])
        for (const holding of holdings) {
          if (!holding.security_id || !holding.institution_value) {
            continue
          }
          if (!state[holding.security_id]) {
            state[holding.security_id] = []
          }
          const latestDate = state[holding.security_id]?.[state[holding.security_id].length - 1]?.date
          if (!latestDate || dayjs(latestDate).isBefore(dayjs(), 'day')) {
            state[holding.security_id].push({
              institution_value: holding.institution_value,
              date: dayjs().format('YYYY-MM-DD')
            })
          }
        }
      }
    )
  }
})

export const selectTrackedHoldings = (state: { holdings: typeof initialSecuritiesState }) => state.holdings
