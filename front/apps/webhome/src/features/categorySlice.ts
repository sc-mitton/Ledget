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
    start?: number;
    end?: number;
    spending?: boolean;
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

type initialState = {
    categories?: Category[],
    monthly_spent: number,
    yearly_spent: number,
    limit_amount_monthly: number,
    limit_amount_yearly: number,
    oldest_yearly_category_created: string,
    sorted: 'default' | 'alpha-asc' | 'alpha-desc' | 'amount-asc' | 'amount-desc',
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
        sorted: 'default',
    } as initialState,
    reducers: {
        addTransaction2Cat: (state, action: PayloadAction<{ categoryId: string | undefined, amount: number }>) => {
            const foundCategory = state.categories?.find(category => category.id === action.payload.categoryId);
            if (foundCategory) {
                const foundIndex = state.categories?.findIndex(category => category.id === action.payload.categoryId);

                if (state.categories) {
                    state.categories[foundIndex || 0] = {
                        ...foundCategory,
                        amount_spent: Big(foundCategory.amount_spent || 0).plus(action.payload.amount).toNumber(),
                    }
                }

                // Update the monthly or yearly spent amount
                const amount_spent_int = Big(action.payload.amount).times(100).toNumber()
                if (foundCategory.period === 'month') {
                    state.monthly_spent += amount_spent_int;
                } else if (foundCategory.period === 'year') {
                    state.yearly_spent += amount_spent_int;
                }
            }
        },
        sortCategoriesAlphaAsc: (state) => {
            state.categories?.sort((a, b) => a.name.localeCompare(b.name))
            state.sorted = 'alpha-asc'
        },
        sortCategoriesAlphaDesc: (state) => {
            state.categories?.sort((a, b) => b.name.localeCompare(a.name))
            state.sorted = 'alpha-desc'
        },
        sortCategoriesAmountAsc: (state) => {
            state.categories?.sort((a, b) => (a.limit_amount || 0) - (b.limit_amount || 0))
            state.sorted = 'amount-asc'
        },
        sortCategoriesAmountDesc: (state) => {
            state.categories?.sort((a, b) => (b.limit_amount || 0) - (a.limit_amount || 0))
            state.sorted = 'amount-desc'
        },
        sortCategoriesDefault: (state) => {
            state.categories?.sort((a, b) => (a.order || 0) - (b.order || 0))
            state.sorted = 'default'
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            extendedApiSlice.endpoints.getCategories.matchFulfilled,
            (state, action) => {
                // If the query was just fetching the categories, and not getting
                // the amount spent, then skip updating the state
                const originalArgs = action.meta.arg.originalArgs
                if ((!originalArgs?.start && !originalArgs?.end) || originalArgs?.spending === false) {
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
    addTransaction2Cat,
    sortCategoriesAlphaAsc,
    sortCategoriesAlphaDesc,
    sortCategoriesAmountAsc,
    sortCategoriesAmountDesc,
    sortCategoriesDefault
} = categorySlice.actions


export const selectCategories = (state: RootState) => state.categories.categories
export const selectCategoriesSorting = (state: RootState) => state.categories.sorted
export const SelectCategoryBillMetaData = createSelector(
    (state: RootState) => ({
        monthly_spent: state.categories.monthly_spent,
        yearly_spent: state.categories.yearly_spent,
        total_monthly_spent: Big(state.categories.monthly_spent)
            .plus(state.bills.total_monthly_bills_amount)
            .minus(state.bills.monthly_bills_amount_remaining)
            .toNumber(),
        total_yearly_spent: Big(state.categories.yearly_spent)
            .plus(state.bills.total_yearly_bills_amount)
            .minus(state.bills.yearly_bills_amount_remaining)
            .toNumber(),
        limit_amount_monthly: state.categories.limit_amount_monthly,
        limit_amount_yearly: state.categories.limit_amount_yearly,
        oldest_yearly_category_created: state.categories.oldest_yearly_category_created,
    }),
    (categoryMetaData) => categoryMetaData
)

export const {
    useAddNewCategoryMutation,
    useRemoveCategoriesMutation,
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
    useUpdateCategoriesMutation,
    useReorderCategoriesMutation,
    useGetCategorySpendingHistoryQuery,
} = extendedApiSlice
