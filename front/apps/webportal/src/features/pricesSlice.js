import { apiSlice } from '@api/apiSlice'


apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPrices: builder.query({
            query: () => '/prices',
        }),
    })
})

export const { useGetPricesQuery } = apiSlice
