import apiSlice from '../apiSlice/slice';

import { PlaidItem, AddNewPlaidItemPayload, GetPlaidTokenResponse } from './types';

const apiWithTags = apiSlice.enhanceEndpoints({
  addTagTypes: ['PlaidItem', 'PlaidToken']
});

export const extendedApiSlice = apiWithTags.injectEndpoints({
  endpoints: (builder) => ({
    getPlaidToken: builder.query<
      GetPlaidTokenResponse & { fulfilledTimeStamp: number },
      { isOnboarding?: boolean; itemId?: string, androidPackage?: string }
    >({
      query: ({ isOnboarding, itemId, androidPackage }) => ({
        url: `plaid-link-token${itemId ? `/${itemId}` : ''}${isOnboarding ? '?is_onboarding=true' : ''}${androidPackage ? `?android_package=${androidPackage}` : ''}`,
      }),
      transformResponse: (response: GetPlaidTokenResponse) => {
        return {
          ...response,
          fulfilledTimeStamp: Date.now()
        }
      },
      keepUnusedDataFor: 60 * 15, // 15 minutes
      providesTags: ['PlaidToken'],
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
    addNewPlaidItem: builder.mutation<any, { data: AddNewPlaidItemPayload }>({
      query: ({ data }) => ({
        url: 'plaid-token-exchange',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['PlaidItem'],
      extraOptions: { maxRetries: 3 }
    }),
    updatePlaidItem: builder.mutation<any, { itemId: string; data: { itemId: string, data: Partial<PlaidItem> } }>(
      {
        query: ({ itemId, data }) => ({
          url: `plaid-item/${itemId}`,
          method: 'PATCH',
          body: data
        }),
        invalidatesTags: ['PlaidItem'],
        extraOptions: { maxRetries: 3 }
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
} = extendedApiSlice;
