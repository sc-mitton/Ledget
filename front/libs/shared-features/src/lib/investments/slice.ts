import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import apiSlice from '../apiSlice/slice';
import { Investments, InvestmentsBalanceHistory, isInvestmentSupported, InvestmentWithProductSupport } from './types';

const investmentsRTKSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInvestments: build.query<Investments, { start: string, end: string } | void>({
      query: () => 'investments',
      providesTags: ['Investment'],
    }),
    getInvestmendsBalanceHistory: build.query<InvestmentsBalanceHistory, { start: string, end: string }>({
      query: () => 'investments/balance-history',
      providesTags: ['InvestmentBalanceHistory'],
    }),
  }),
});
export const { useGetInvestmentsQuery, useGetInvestmendsBalanceHistoryQuery } = investmentsRTKSlice;

const initialInvestmentsState = {
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

export const selectTrackedHoldings = (state: { holdings: typeof initialInvestmentsState }) => state.holdings
