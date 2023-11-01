import { apiSlice } from '@api/apiSlice'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], { month: string, year: string }>({
            query: (params) => ({
                url: 'categories',
                params: params,
                method: 'GET',
            })
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

export const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [] as Category[],
        unSyncedCategories: [] as Category[],
        monthly_spent: 0,
        yearly_spent: 0,
        limit_amount_monthly: 0,
        limit_amount_yearly: 0,
        oldest_yearly_category_created: null,
    },
    reducers: {
        addTransaction2Cat: (state, action: PayloadAction<{ categoryId: string, amount: number }>) => {
            const foundCategory = state.categories.find(category => category.id === action.payload.categoryId);
            if (foundCategory) {
                const foundIndex = state.categories.findIndex(category => category.id === action.payload.categoryId);
                state.categories[foundIndex] = {
                    ...foundCategory,
                    amount_spent: foundCategory.amount_spent + action.payload.amount,
                }

                // Update the monthly or yearly spent amount
                if (foundCategory.period === 'month') {
                    state.monthly_spent += action.payload.amount;
                } else if (foundCategory.period === 'year') {
                    state.yearly_spent += action.payload.amount;
                }

                // Add the category to the unsynced categories (if it's not already there)
                // since it's now out of sync with the server
                if (state.unSyncedCategories.includes(foundCategory) === false) {
                    state.unSyncedCategories.push(foundCategory)
                }
            }
        },
        clearUnsyncedCategories: (state) => {
            state.unSyncedCategories = []
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            extendedApiSlice.endpoints.getCategories.matchFulfilled,
            (state, action) => {
                state.categories = action.payload
                let monthlySpent = Big(0)
                let yearlySpent = Big(0)
                let limitAmountMonthly = 0
                let limitAmountYearly = 0
                let oldestYearlyCategoryCreated = ''

                state.categories.forEach(category => {
                    if (category.period === 'month') {
                        monthlySpent = monthlySpent.times(100).plus(category.amount_spent)
                        limitAmountMonthly += category.limit_amount
                    } else if (category.period === 'year') {
                        yearlySpent = yearlySpent.times(100).plus(category.amount_spent)
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
            }
        )
    }
})

export const {
    addTransaction2Cat,
    clearUnsyncedCategories,
} = categorySlice.actions

// selectors
export const selectCategoryMetaData = (state: any) => ({
    monthly_spent: state.categories.monthly_spent,
    yearly_spent: state.categories.yearly_spent,
    limit_amount_monthly: state.categories.limit_amount_monthly,
    limit_amount_yearly: state.categories.limit_amount_yearly,
    oldest_yearly_category_created: state.categories.oldest_yearly_category_created,
})

export const {
    useAddNewCategoryMutation,
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
} = extendedApiSlice
