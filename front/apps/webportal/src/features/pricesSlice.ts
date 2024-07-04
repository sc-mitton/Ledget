import { apiSlice } from '@ledget/shared-features'

type Price = {
    id: string
    nickname: string
    unit_amount: number
    metadata: {
        trial_period_days: number
    }
}

export const pricesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPrices: builder.query<Price[], void>({
            query: () => '/prices',
        }),
    })
})

export const { useGetPricesQuery } = pricesSlice
