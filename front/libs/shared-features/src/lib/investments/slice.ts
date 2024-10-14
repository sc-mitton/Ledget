import apiSlice from '../apiSlice/slice';
import { Investments, InvestmentsBalanceHistory } from './types';

const liabilitiesSlice = apiSlice.injectEndpoints({
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
export const { useGetInvestmentsQuery, useGetInvestmendsBalanceHistoryQuery } = liabilitiesSlice;
