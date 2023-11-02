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
    category_confirmed: boolean,
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


type initialState = {
    categories: Category[],
    unSyncedCategories: Category[],
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
        addTransaction2Cat: (state, action: PayloadAction<{ categoryId: string, amount: number }>) => {
            const foundCategory = state.categories.find(category => category.id === action.payload.categoryId);
            if (foundCategory) {
                const foundIndex = state.categories.findIndex(category => category.id === action.payload.categoryId);

                // Add the category to the unsynced categories (if it's not already there)
                // since it's now out of sync with the server
                if (!state.unSyncedCategories.includes(foundCategory)) {
                    state.unSyncedCategories.push(foundCategory)
                }

                state.categories[foundIndex] = {
                    ...foundCategory,
                    amount_spent: Big(foundCategory.amount_spent || 0).plus(action.payload.amount).toNumber(),
                    category_confirmed: true,
                }

                // Update the monthly or yearly spent amount
                if (foundCategory.period === 'month') {
                    state.monthly_spent += action.payload.amount;
                } else if (foundCategory.period === 'year') {
                    state.yearly_spent += action.payload.amount;
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
    clearUnsyncedCategories,
} = categorySlice.actions

export const selectCategories = createSelector(
    (state: { categories: initialState }) => state.categories.categories,
    (categories) => categories
)
export const selectCategoryMetaData = createSelector(
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
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
} = extendedApiSlice
