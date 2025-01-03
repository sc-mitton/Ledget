import apiSlice from '../apiSlice/slice';

import type { Price } from './types';

const apiwithTags = apiSlice.enhanceEndpoints({
  addTagTypes: ['Price'],
});

export const pricesSlice = apiwithTags.injectEndpoints({
  endpoints: (builder) => ({
    getPrices: builder.query<Price[], void>({
      query: () => 'prices',
      providesTags: ['Price'],
    }),
  }),
});

export const { useGetPricesQuery } = pricesSlice;
