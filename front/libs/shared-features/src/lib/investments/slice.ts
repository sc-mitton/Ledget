import dayjs from 'dayjs';

import apiSlice from '../apiSlice/slice';
import {
  InvestmentsResponse,
  InvestmentsBalanceHistory,
  GetInvestmentsQuery,
  InvestmentsBalanceQuery,
  TransformedInvestmentsBalanceHistory,
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
  }),
});

export const {
  useGetInvestmentsQuery,
  useLazyGetInvestmentsQuery,
  useGetInvestmentsBalanceHistoryQuery,
  useLazyGetInvestmentsBalanceHistoryQuery,
} = investmentsRTKSlice;
