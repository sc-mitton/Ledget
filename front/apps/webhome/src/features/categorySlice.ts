import { apiSlice } from '@api/apiSlice'

import Big from 'big.js'

interface Alert {
    percent_amount: number
}

export interface Category {
    id: string,
    period: 'year' | 'month',
    name: string,
    created: string,
    emoji: string | null,
    limit_amount: number,
    amount_spent: number,
    alerts: Alert[],
}

interface GetCategoriesResponse {
    categories: Category[],
    monthly_spent: number,
    yearly_spent: number,
    limit_amount_monthly: number,
    limit_amount_yearly: number,
    oldest_yearly_category_created: string | null,
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<GetCategoriesResponse, { month: string, year: string }>({
            query: (params) => ({
                url: 'categories',
                params: params,
                method: 'GET',
            }),
            transformResponse: (response: Category[]) => {
                return {
                    categories: response,
                    monthly_spent: response.reduce((acc: number, category: Category) => {
                        return category.period === 'month'
                            ? Big(category.amount_spent || 0).times(100).add(acc).toNumber()
                            : acc
                    }, 0),
                    yearly_spent: response.reduce((acc: number, category: Category) => {
                        return category.period === 'year'
                            ? Big(category.amount_spent || 0).times(100).add(acc).toNumber()
                            : acc
                    }, 0),
                    limit_amount_monthly: response.reduce((acc: number, category: Category) =>
                        category.period === 'month' ? (acc += category.limit_amount) : acc, 0),
                    limit_amount_yearly: response.reduce((acc: number, category: Category) =>
                        category.period === 'year' ? (acc += category.limit_amount) : acc, 0),
                    oldest_yearly_category_created: response.reduce((acc: string | null, category: Category) => {
                        if (category.period === 'year') {
                            return acc === null || new Date(acc) < new Date(category.created) ? category.created : acc
                        }
                        return acc
                    }, null),
                }
            }
        }),
        addNewCategory: builder.mutation<any, Category[] | Category>({
            query: (data) => ({
                url: 'category',
                method: 'POST',
                body: data,
            }),
        })
    }),
})

export const {
    useAddNewCategoryMutation,
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
} = extendedApiSlice
