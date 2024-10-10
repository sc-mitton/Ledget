import apiSlice from '../apiSlice/slice';

import type { Liabilities } from './types';

const liabilitiesSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLiabilities: build.query<Liabilities, void>({
      query: () => 'liabilities',
      providesTags: ['Liability'],
    }),
  }),
});

export const { useGetLiabilitiesQuery } = liabilitiesSlice;
