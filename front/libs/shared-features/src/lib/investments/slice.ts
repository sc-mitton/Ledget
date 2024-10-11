import apiSlice from '../apiSlice/slice';
import { Investments } from './types';

const liabilitiesSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInvestments: build.query<Investments, void>({
      query: () => 'investments',
      providesTags: ['Investmen'],
    }),
  }),

});
export const { useGetInvestmentsQuery } = liabilitiesSlice;
