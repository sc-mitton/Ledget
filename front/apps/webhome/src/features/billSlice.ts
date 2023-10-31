import { apiSlice } from '@api/apiSlice'
import Big from 'big.js'
import { number } from 'yup'

interface Reminder {
    period: 'week' | 'day',
    offset: number,
}

interface BaseBill {
    is_paid: boolean,
    period: 'year' | 'month' | 'once',
    name: string,
    emoji: string,
    lower_amount: number,
    upper_amount: number,
    reminders: Reminder[],
}

interface Bill extends BaseBill {
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

interface GetBillsResponse {
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

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBills: builder.query<GetBillsResponse, { month: string, year: string }>({
            query: () => ({
                url: 'bills',
                method: 'GET',
            }),
            transformResponse: (response: Bill[]) => {
                const today = new Date()
                const bills: TransformedBill[] = []
                let paidMonthlyBills = 0
                let paidYearlyBills = 0
                let numberOfMonthlyBills = 0
                let numberOfYearlyBills = 0
                let monthlyBillsAmountRemaining = Big(0)
                let yearlyBillsAmountRemaining = Big(0)
                let totalMonthlyBillsAmount = Big(0)
                let totalYearlyBillsAmount = Big(0)

                response.forEach((bill) => {
                    const { day, week, week_day, month, year, ...rest } = bill
                    if (rest.is_paid) {
                        if (rest.period === 'month') {
                            monthlyBillsAmountRemaining = monthlyBillsAmountRemaining.plus(rest.upper_amount)
                        } else if (rest.period === 'year') {
                            yearlyBillsAmountRemaining = yearlyBillsAmountRemaining.plus(rest.upper_amount)
                        }
                    } else {
                        rest.period === 'month' ? numberOfMonthlyBills++ : numberOfYearlyBills++
                    }
                    totalMonthlyBillsAmount = totalMonthlyBillsAmount.plus(rest.upper_amount)
                    totalYearlyBillsAmount = totalYearlyBillsAmount.plus(rest.upper_amount)

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
                return {
                    bills: bills.sort((a, b) => {
                        return new Date(a.date).getTime() - new Date(b.date).getTime()
                    }),
                    monthly_bills_paid: paidMonthlyBills,
                    yearly_bills_paid: paidYearlyBills,
                    number_of_monthly_bills: numberOfMonthlyBills,
                    number_of_yearly_bills: numberOfYearlyBills,
                    monthly_bills_amount_remaining: monthlyBillsAmountRemaining.toNumber(),
                    yearly_bills_amount_remaining: yearlyBillsAmountRemaining.toNumber(),
                    total_monthly_bills_amount: totalMonthlyBillsAmount.toNumber(),
                    total_yearly_bills_amount: totalYearlyBillsAmount.toNumber(),
                }
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
        })
    }),
})

export const {
    useAddnewBillMutation,
    useGetBillsQuery,
    useLazyGetBillsQuery,
    useGetBillRecommendationsQuery,
} = extendedApiSlice
