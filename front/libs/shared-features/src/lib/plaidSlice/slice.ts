import apiSlice from '../apiSlice/slice';
import { createSlice, createSelector } from '@reduxjs/toolkit';

import { PlaidItem, AddNewPlaidItemPayload, GetPlaidTokenResponse, Institution, RootStateWithInstitutions } from './types';

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
    deletePlaidItem: builder.mutation<void, string>({
      query: (itemId) => ({
        url: `plaid-item/${itemId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['PlaidItem']
    }),
    exchangePlaidToken: builder.mutation<any, { data: AddNewPlaidItemPayload }>({
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


export const institutionsSlice = createSlice({
  name: 'institutions',
  initialState: {
    map: {} as { [key: string]: string },
    institutions: {} as { [key: string]: Institution }
  },
  reducers: { foo: (state, action) => { } },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedApiSlice.endpoints.getPlaidItems.matchFulfilled,
      (state, action) => {
        action.payload.forEach((item) => {
          item.accounts.forEach((account) => {
            if (item.institution) {
              state.map[account.id] = item.institution?.id;
              state.institutions[item.institution.id] = item.institution;
            }
          });
        })
      }
    );
  }
});

const selectInstitutionId = (state: RootStateWithInstitutions, accountId: string) => (state.institutions.map[accountId] || accountId);
const selectInstitutions = (state: RootStateWithInstitutions) => state.institutions.institutions;
export const selectInstitution = createSelector(
  [selectInstitutionId, selectInstitutions],
  (institutionId, institutions) => institutions[institutionId]
);

export const {
  useGetPlaidTokenQuery,
  useLazyGetPlaidTokenQuery,
  useGetPlaidItemsQuery,
  useLazyGetPlaidItemsQuery,
  useExchangePlaidTokenMutation,
  useDeletePlaidItemMutation,
} = extendedApiSlice;
