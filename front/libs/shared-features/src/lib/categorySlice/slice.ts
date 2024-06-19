import apiSlice from '../apiSlice/slice';

import Big from 'big.js';
import {
  Category,
  CategoryQueryParams,
  CategorySpendingHistory,
  NewCategory,
  UpdateCategory
} from './types';

export const categorySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], CategoryQueryParams | void>({
      query: (params) => {
        const queryObj = {
          url: 'categories',
          method: 'GET'
        };
        return params ? { ...queryObj, params } : queryObj;
      },
      keepUnusedDataFor: 15 * 60,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category', id } as const)),
              { type: 'Category', id: 'LIST' }
            ]
          : [{ type: 'Category', id: 'LIST' }]
    }),
    getCategorySpendingHistory: builder.query<
      CategorySpendingHistory[],
      { categoryId: string }
    >({
      query: ({ categoryId }) => ({
        url: `categories/${categoryId}/spending-history`,
        method: 'GET'
      }),
      keepUnusedDataFor: 15 * 60,
      transformResponse: (response: CategorySpendingHistory[]) => {
        const spendingHistory = response.map((history) => ({
          ...history,
          amount_spent: Big(history.amount_spent).times(100).toNumber()
        }));
        return spendingHistory;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              { type: 'SpendingHistory', id: arg.categoryId },
              { type: 'SpendingHistory', id: 'LIST' }
            ]
          : [{ type: 'SpendingHistory', id: 'LIST' }]
    }),
    addNewCategory: builder.mutation<any, NewCategory[] | NewCategory>({
      query: (data) => ({
        url: 'categories',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }]
    }),
    updateCategories: builder.mutation<any, UpdateCategory[] | UpdateCategory>({
      query: (data) => {
        if (Array.isArray(data)) {
          return {
            url: 'categories',
            method: 'PUT',
            body: data
          };
        } else {
          return {
            url: `categories/${data.id}`,
            method: data.limit_amount ? 'PUT' : 'PATCH',
            body: data
          };
        }
      },
      invalidatesTags: (result, error, arg) => {
        const categoryIds = Array.isArray(arg)
          ? arg.map((category) => category.id)
          : [arg.id];
        const spendingHistoryTags = categoryIds.map(
          (categoryId) => ({ type: 'SpendingHistory', id: categoryId } as const)
        );
        return result
          ? [{ type: 'Category', id: 'LIST' }, ...spendingHistoryTags]
          : [{ type: 'Category', id: 'LIST' }];
      }
    }),
    reorderCategories: builder.mutation<any, string[]>({
      query: (data) => ({
        url: 'categories/order',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }]
    }),
    removeCategories: builder.mutation<any, string[]>({
      query: (data) => ({
        url: 'categories/items',
        method: 'DELETE',
        body: {
          categories: data,
          tz: new Date().getTimezoneOffset()
        }
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }]
    })
  })
});

export function isCategory(obj: any): obj is Category {
  return 'alerts' in obj;
}

export const {
  useAddNewCategoryMutation,
  useRemoveCategoriesMutation,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useUpdateCategoriesMutation,
  useReorderCategoriesMutation,
  useGetCategorySpendingHistoryQuery
} = categorySlice;

export default categorySlice;
