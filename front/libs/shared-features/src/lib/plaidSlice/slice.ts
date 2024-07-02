import apiSlice from '../apiSlice/slice';

import { PlaidItem } from './types';

const apiWithTags = apiSlice.enhanceEndpoints({
  addTagTypes: ['PlaidItem', 'PlaidToken']
});

export const extendedApiSlice = apiWithTags.injectEndpoints({
  endpoints: (builder) => ({
    getPlaidToken: builder.query<
      string,
      { isOnboarding: boolean; itemId: string }
    >({
      query: ({ isOnboarding, itemId }) => ({
        url: `plaid-link-token${isOnboarding ? '?is_onboarding=true' : ''}${itemId ? `/${itemId}` : ''
          }`
      }),
      providesTags: ['PlaidToken']
    }),
    getPlaidItems: builder.query<PlaidItem[], { userId?: string } | void>({
      query: (data) =>
        data ? `plaid-items?user=${data.userId}` : 'plaid-items',
      providesTags: ['PlaidItem']
    }),
    deletePlaidItem: builder.mutation<void, { itemId: string }>({
      query: ({ itemId }) => ({
        url: `plaid_item/${itemId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['PlaidItem']
    }),
    addNewPlaidItem: builder.mutation<any, { data: PlaidItem }>({
      query: ({ data }) => ({
        url: 'plaid-token-exchange',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['PlaidItem'],
      extraOptions: { maxRetries: 5 }
    }),
    updatePlaidItem: builder.mutation<any, { itemId: string; data: PlaidItem }>(
      {
        query: ({ itemId, data }) => ({
          url: `plaid-item/${itemId}`,
          method: 'PATCH',
          body: data
        }),
        invalidatesTags: ['PlaidItem'],
        extraOptions: { maxRetries: 5 }
      }
    )
  })
});

export const {
  useGetPlaidTokenQuery,
  useLazyGetPlaidTokenQuery,
  useGetPlaidItemsQuery,
  useAddNewPlaidItemMutation,
  useDeletePlaidItemMutation,
  useUpdatePlaidItemMutation
} = extendedApiSlice;
