import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBills: builder.query({
            query: () => ({
                url: 'bills',
                method: 'GET',
            }),
        }),
        getBillRecommendations: builder.query({
            query: () => ({
                url: 'bills/recommendations',
                method: 'GET',
            }),
        }),
        addnewBill: builder.mutation({
            query: ({ data }) => ({
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
    useGetBillRecommendationsQuery,
} = extendedApiSlice
