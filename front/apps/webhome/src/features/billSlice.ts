import { apiSlice } from '@api/apiSlice'
import { Transform } from 'stream'

interface Reminder {
    period: 'week' | 'day',
    offset: number,
}

interface BaseBill {
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

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBills: builder.query<TransformedBill[], { month: string, year: string }>({
            query: () => ({
                url: 'bills',
                method: 'GET',
            }),
            transformResponse: (response: Bill[]) => {
                const today = new Date()
                const bills: TransformedBill[] = []

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

                return bills.sort((a, b) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                })
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
