import { apiSlice } from '@api/apiSlice'
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'

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
    is_default: boolean,
}

export interface SplitCategory extends Category {
    fraction: number
}

interface CategoryQueryParams {
    start?: number;
    end?: number;
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], CategoryQueryParams | void>({
            query: (params) => {
                const queryObj = {
                    url: 'categories',
                    method: 'GET',
                }
                if (params) {
                    return { ...queryObj, params };
                }
                return queryObj;
            },
            keepUnusedDataFor: 15 * 60,
            providesTags: ['Category'],
        }),
        addNewCategory: builder.mutation<any, Category[]>({
            query: (data) => ({
                url: 'category',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category']
        }),
        updateCategories: builder.mutation<any, Category[]>({
            query: (data) => ({
                url: 'categories',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Category']
        }),
        reorderCategories: builder.mutation<any, string[]>({
            query: (data) => ({
                url: 'categories/order',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category']
        }),
        deleteCategories: builder.mutation<any, string[]>({
            query: (data) => ({
                url: 'categories',
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: ['Category']
        }),
    }),
})

export function isCategory(obj: any): obj is Category {
    return 'alerts' in obj
}

type initialState = {
    categories: Category[],
    monthly_spent: number,
    yearly_spent: number,
    limit_amount_monthly: number,
    limit_amount_yearly: number,
    oldest_yearly_category_created: string,
}

export const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [] as Category[],
        unSyncedCategories: [] as Category[],
        monthly_spent: 0,
        yearly_spent: 0,
        limit_amount_monthly: 0,
        limit_amount_yearly: 0,
        oldest_yearly_category_created: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    } as initialState,
    reducers: {
        addTransaction2Cat: (state, action: PayloadAction<{ categoryId: string | undefined, amount: number }>) => {
            const foundCategory = state.categories.find(category => category.id === action.payload.categoryId);
            if (foundCategory) {
                const foundIndex = state.categories.findIndex(category => category.id === action.payload.categoryId);

                state.categories[foundIndex] = {
                    ...foundCategory,
                    amount_spent: Big(foundCategory.amount_spent || 0).plus(action.payload.amount).toNumber(),
                }

                // Update the monthly or yearly spent amount
                const amount_spent_int = Big(action.payload.amount).times(100).toNumber()
                if (foundCategory.period === 'month') {
                    state.monthly_spent += amount_spent_int;
                } else if (foundCategory.period === 'year') {
                    state.yearly_spent += amount_spent_int;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            extendedApiSlice.endpoints.getCategories.matchFulfilled,
            (state, action) => {
                // If the query was just fetching the categories, and not getting
                // the amount spent, then skip updating the state
                const originalArgs = action.meta.arg.originalArgs
                if (!originalArgs?.start && !originalArgs?.end) {
                    return
                }

                state.categories = action.payload
                let monthlySpent = Big(0)
                let yearlySpent = Big(0)
                let limitAmountMonthly = 0
                let limitAmountYearly = 0
                let oldestYearlyCategoryCreated = ''

                action.payload.forEach(category => {

                    if (category.period === 'month') {
                        if (category.amount_spent) {
                            monthlySpent = monthlySpent.plus(Big(category.amount_spent).times(100))
                        }
                        limitAmountMonthly += category.limit_amount
                    } else if (category.period === 'year') {
                        if (category.amount_spent) {
                            yearlySpent = yearlySpent.plus(Big(category.amount_spent).times(100))
                        }
                        limitAmountYearly += category.limit_amount
                        if (oldestYearlyCategoryCreated === '' || new Date(oldestYearlyCategoryCreated) > new Date(category.created)) {
                            oldestYearlyCategoryCreated = category.created
                        }
                    }
                })
                state.monthly_spent = monthlySpent.toNumber()
                state.yearly_spent = yearlySpent.toNumber()
                state.limit_amount_monthly = limitAmountMonthly
                state.limit_amount_yearly = limitAmountYearly
                state.oldest_yearly_category_created = oldestYearlyCategoryCreated
            }
        )
    }
})

export const {
    addTransaction2Cat
} = categorySlice.actions

export const selectCategories = createSelector(
    (state: { categories: initialState }) => state.categories.categories,
    (categories) => categories
)
export const SelectCategoryBillMetaData = createSelector(
    (state: { categories: initialState }) => ({
        monthly_spent: state.categories.monthly_spent,
        yearly_spent: state.categories.yearly_spent,
        limit_amount_monthly: state.categories.limit_amount_monthly,
        limit_amount_yearly: state.categories.limit_amount_yearly,
        oldest_yearly_category_created: state.categories.oldest_yearly_category_created,
    }),
    (categoryMetaData) => categoryMetaData
)

export const {
    useAddNewCategoryMutation,
    useDeleteCategoriesMutation,
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
    useUpdateCategoriesMutation,
    useReorderCategoriesMutation,
} = extendedApiSlice
