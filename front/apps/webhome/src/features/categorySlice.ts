import { apiSlice } from '@api/apiSlice'
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'

import Big from 'big.js'
import { RootState } from './store'

export interface Alert {
    percent_amount: number
}

export interface Category {
    id: string,
    period: 'year' | 'month',
    name: string,
    created: string,
    emoji?: string | null,
    limit_amount: number,
    amount_spent: number,
    alerts: Alert[],
    is_default: boolean,
    has_transactions: boolean,
    order?: number,
}

export type NewCategory = Partial<Pick<Category, 'alerts' | 'emoji' | 'id'>> & Pick<Category, | 'name' | 'limit_amount' | 'period'>
export type UpdateCategory = NewCategory & Pick<Category, 'id'>

export interface SplitCategory extends Category {
    fraction: number
}

interface CategoryQueryParams {
    month?: number;
    year?: number;
    spending?: boolean;
    start?: number
    end?: number
}

interface CategorySpendingHistory {
    month: number,
    year: number,
    amount_spent: number,
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], CategoryQueryParams | void>({
            query: (params) => {
                const queryObj = {
                    url: 'categories',
                    method: 'GET',
                }
                return params ? { ...queryObj, params } : queryObj
            },
            keepUnusedDataFor: 15 * 60,
            providesTags: (result, error, arg) => result
                ? [...result.map(({ id }) => ({ type: 'Category', id } as const)), { type: 'Category', id: 'LIST' }]
                : [{ type: 'Category', id: 'LIST' }]
        }),
        getCategorySpendingHistory: builder.query<CategorySpendingHistory[], { categoryId: string }>({
            query: ({ categoryId }) => ({
                url: `categories/${categoryId}/spending-history`,
                method: 'GET',
            }),
            keepUnusedDataFor: 15 * 60,
            transformResponse: (response: CategorySpendingHistory[]) => {
                const spendingHistory = response.map(history => ({
                    ...history,
                    amount_spent: Big(history.amount_spent).times(100).toNumber(),
                }))
                return spendingHistory
            },
            providesTags: (result, error, arg) => result
                ? [{ type: 'SpendingHistory', id: arg.categoryId }, { type: 'SpendingHistory', id: 'LIST' }]
                : [{ type: 'SpendingHistory', id: 'LIST' }]
        }),
        addNewCategory: builder.mutation<any, NewCategory[] | NewCategory>({
            query: (data) => ({
                url: 'categories',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }]
        }),
        updateCategories: builder.mutation<any, UpdateCategory[] | UpdateCategory>({
            query: (data) => {
                if (Array.isArray(data)) {
                    return {
                        url: 'categories',
                        method: 'PUT',
                        body: data,
                    }
                } else {
                    return {
                        url: `categories/${data.id}`,
                        method: data.limit_amount ? 'PUT' : 'PATCH',
                        body: data,
                    }
                }
            },
            invalidatesTags: (result, error, arg) => {
                const categoryIds = Array.isArray(arg) ? arg.map(category => category.id) : [arg.id]
                const spendingHistoryTags = categoryIds.map(categoryId => ({ type: 'SpendingHistory', id: categoryId } as const))
                return result
                    ? [{ type: 'Category', id: 'LIST' }, ...spendingHistoryTags]
                    : [{ type: 'Category', id: 'LIST' }]
            }
        }),
        reorderCategories: builder.mutation<any, string[]>({
            query: (data) => ({
                url: 'categories/order',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }]
        }),
        removeCategories: builder.mutation<any, string[]>({
            query: (data) => ({
                url: 'categories/items',
                method: 'DELETE',
                body: {
                    categories: data,
                    tz: new Date().getTimezoneOffset(),
                },
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }]
        }),
    }),
})

export function isCategory(obj: any): obj is Category {
    return 'alerts' in obj
}

export const {
    useAddNewCategoryMutation,
    useRemoveCategoriesMutation,
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
    useUpdateCategoriesMutation,
    useReorderCategoriesMutation,
    useGetCategorySpendingHistoryQuery,
} = extendedApiSlice
