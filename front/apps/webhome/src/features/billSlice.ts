import { apiSlice } from '@api/apiSlice'
import Big from 'big.js'
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'

interface Reminder {
    period: 'week' | 'day',
    offset: number,
}

interface BaseBill {
    id: string,
    is_paid: boolean,
    period: 'year' | 'month' | 'once',
    name: string,
    emoji: string,
    lower_amount: number,
    upper_amount: number,
    bill_confirmed: boolean,
    reminders: Reminder[],
}

export interface Bill extends BaseBill {
    day?: number,
    week?: number,
    week_day?: number,
    month?: number,
    year?: number,
    reminders: Reminder[],
}

export interface TransformedBill extends BaseBill {
    date: string,
}

interface BillQueryParams {
    month?: string;
    year?: string;
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBills: builder.query<TransformedBill[], BillQueryParams | void>({
            query: (params) => {
                const queryObj = {
                    url: 'bills',
                    method: 'GET',
                }
                if (params) {
                    return { ...queryObj, params };
                }
                return queryObj;
            },
            keepUnusedDataFor: 15 * 60,
            providesTags: ['Bill'],
            transformResponse: (response: Bill[]) => {
                const today = new Date()
                const bills: TransformedBill[] = []

                // Set date for each bill
                response.forEach((bill) => {
                    const { day, week, week_day, month, year, ...rest } = bill

                    if (bill.period === 'month' && (bill.week && bill.week_day)) {
                        // monthly bills with week and week_day

                        let date = new Date(today.getFullYear(), today.getMonth())
                        date.setDate(1 + (week! - 1) * 7)
                        // subtract one because backend models indexes at 1
                        date.setDate(date.getDate() + (week_day! - 1 - date.getDay() + 7) % 7)

                        bills.push({
                            ...rest,
                            date: new Date(new Date().getFullYear(), new Date().getMonth(), day || 1).toISOString(),
                        })
                    } else if (bill.period === 'month' && bill.day) {
                        // monthly bills with day

                        bills.push({
                            ...rest,
                            date: new Date(new Date().getFullYear(), new Date().getMonth(), day || 1).toISOString(),
                        })
                    } else if (bill.period === 'once' && bill.month && bill.day && bill.year) {
                        // once bills

                        bills.push({
                            ...rest,
                            date: new Date(year!, month! - 1, day!).toISOString(),
                        })
                    } else if (bill.period === 'year' && bill.month && bill.day) {
                        // yearly bills

                        bills.push({
                            ...rest,
                            date: new Date(today.getFullYear(), month! - 1, day!).toISOString(),
                        })
                    }
                })
                return bills.sort((a, b) => { return new Date(a.date).getTime() - new Date(b.date).getTime() })
            }
        }),
        getBillRecommendations: builder.query<any, any>({
            query: () => ({
                url: 'bills/recommendations',
                method: 'GET',
            }),
        }),
        addnewBill: builder.mutation<any, Bill | Bill[]>({
            query: (data) => ({
                url: 'bill',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Bill'],
        }),
        updateBills: builder.mutation<any, Bill[]>({
            query: (data) => ({
                url: 'bills',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Bill'],
        }),
        deleteBills: builder.mutation<any, string[]>({
            query: (data) => ({
                url: 'bills',
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: ['Bill'],
        }),
    }),
})

type initialState = {
    bills: TransformedBill[],
    monthly_bills_paid: number,
    yearly_bills_paid: number,
    number_of_monthly_bills: number,
    number_of_yearly_bills: number,
    monthly_bills_amount_remaining: number,
    yearly_bills_amount_remaining: number,
    total_monthly_bills_amount: number,
    total_yearly_bills_amount: number,
}

export function isBill(obj: any | undefined): obj is Bill {
    return obj ? 'alerts' in obj : false
}

export const billSlice = createSlice({
    name: 'bills',
    initialState: {
        bills: [] as TransformedBill[],
        unSyncedBills: [] as TransformedBill[],
        monthly_bills_paid: 0,
        yearly_bills_paid: 0,
        number_of_monthly_bills: 0,
        number_of_yearly_bills: 0,
        monthly_bills_amount_remaining: 0,
        yearly_bills_amount_remaining: 0,
        total_monthly_bills_amount: 0,
        total_yearly_bills_amount: 0,
    } as initialState,
    reducers: {
        addTransaction2Bill: (state, action: PayloadAction<{ billId: string | undefined, amount: number }>) => {
            const foundBill = state.bills.find(bill => bill.id === action.payload.billId);
            if (foundBill) {

                const foundIndex = state.bills.findIndex(bill => bill.id === action.payload.billId);
                state.bills[foundIndex] = { ...foundBill, is_paid: true, bill_confirmed: true }

                // Update the monthly or yearly spent amount
                if (foundBill.period === 'month') {
                    state.monthly_bills_paid++
                    state.monthly_bills_amount_remaining =
                        Big(state.monthly_bills_amount_remaining).minus(Big(action.payload.amount).times(100)).toNumber()
                } else if (foundBill.period === 'year') {
                    state.yearly_bills_paid++
                    state.yearly_bills_amount_remaining =
                        Big(state.monthly_bills_amount_remaining).minus(Big(action.payload.amount).times(100)).toNumber()
                }
            }
        },
        sortBillsByAlpha: (state) => {
            state.bills.sort((a, b) => {
                const nameA = a.name.toUpperCase()
                const nameB = b.name.toUpperCase()
                return nameA.localeCompare(nameB)
            })
        },
        sortBillsByDate: (state) => {
            state.bills.sort((a, b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            })
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            extendedApiSlice.endpoints.getBills.matchFulfilled,
            (state, action) => {
                // If the query was just fetching the categories, and not getting
                // the amount spent, then skip updating the state
                const originalArgs = action.meta.arg.originalArgs
                if (!originalArgs?.month && !originalArgs?.year) {
                    return
                }

                state.bills = action.payload
                let paidMonthlyBills = 0
                let paidYearlyBills = 0
                let numberOfMonthlyBills = 0
                let numberOfYearlyBills = 0
                let monthlyBillsAmountRemaining = Big(0)
                let yearlyBillsAmountRemaining = Big(0)
                let totalMonthlyBillsAmount = Big(0)
                let totalYearlyBillsAmount = Big(0)

                action.payload.forEach((bill) => {
                    if (bill.is_paid) {
                        if (bill.period === 'month') {
                            paidMonthlyBills++
                            monthlyBillsAmountRemaining = monthlyBillsAmountRemaining.plus(bill.upper_amount)
                        } else if (bill.period === 'year') {
                            paidYearlyBills++
                            yearlyBillsAmountRemaining = yearlyBillsAmountRemaining.plus(bill.upper_amount)
                        }
                    } else {
                        if (bill.period === 'month') {
                            monthlyBillsAmountRemaining = monthlyBillsAmountRemaining.plus(bill.upper_amount)
                        } else if (bill.period === 'year') {
                            yearlyBillsAmountRemaining = yearlyBillsAmountRemaining.plus(bill.upper_amount)
                        }
                    }
                    bill.period === 'month' ? numberOfMonthlyBills++ : numberOfYearlyBills++
                    bill.period === 'month'
                        ? totalMonthlyBillsAmount = totalMonthlyBillsAmount.plus(bill.upper_amount)
                        : totalYearlyBillsAmount = totalYearlyBillsAmount.plus(bill.upper_amount)
                })
                state.monthly_bills_paid = paidMonthlyBills
                state.yearly_bills_paid = paidYearlyBills
                state.number_of_monthly_bills = numberOfMonthlyBills
                state.number_of_yearly_bills = numberOfYearlyBills
                state.monthly_bills_amount_remaining = monthlyBillsAmountRemaining.toNumber()
                state.yearly_bills_amount_remaining = yearlyBillsAmountRemaining.toNumber()
                state.total_monthly_bills_amount = totalMonthlyBillsAmount.toNumber()
                state.total_yearly_bills_amount = totalYearlyBillsAmount.toNumber()
            }
        )
    }
})

export const {
    addTransaction2Bill,
    sortBillsByAlpha,
    sortBillsByDate,
} = billSlice.actions

export const selectBills = createSelector(
    (state: { bills: initialState }) => state.bills.bills,
    (bills) => bills
)
export const selectBillMetaData = createSelector(
    (state: { bills: initialState }) => ({
        monthly_bills_paid: state.bills.monthly_bills_paid,
        yearly_bills_paid: state.bills.yearly_bills_paid,
        number_of_monthly_bills: state.bills.number_of_monthly_bills,
        number_of_yearly_bills: state.bills.number_of_yearly_bills,
        monthly_bills_amount_remaining: state.bills.monthly_bills_amount_remaining,
        yearly_bills_amount_remaining: state.bills.yearly_bills_amount_remaining,
        total_monthly_bills_amount: state.bills.total_monthly_bills_amount,
        total_yearly_bills_amount: state.bills.total_yearly_bills_amount,
    }),
    (billMetaData) => billMetaData
)

export const {
    useAddnewBillMutation,
    useGetBillsQuery,
    useLazyGetBillsQuery,
    useGetBillRecommendationsQuery,
    useUpdateBillsMutation,
    useDeleteBillsMutation,
} = extendedApiSlice
