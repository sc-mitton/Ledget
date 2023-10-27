import { apiSlice } from '@api/apiSlice'

interface Reminder {
    period: 'week' | 'day',
    offset: number,
}

interface Bill {
    period: 'year' | 'month',
    name: string,
    emoji: string,
    lower_amount: number,
    upper_amount: number,
    day?: number,
    week?: number,
    week_day?: number,
    month?: number,
    reminders: Reminder[],
}

interface GetBillsResponse {
    monthlyBills: Bill[],
    yearlyBills: Bill[],
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBills: builder.query<GetBillsResponse, { month: string, year: string }>({
            query: () => ({
                url: 'bills',
                method: 'GET',
            }),
            transformResponse: (response: Bill[]) => {
                return {
                    monthlyBills: response ? response.filter((bill: Bill) => bill.period === 'month') : [],
                    yearlyBills: response ? response.filter((bill: Bill) => bill.period === 'year') : []
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
