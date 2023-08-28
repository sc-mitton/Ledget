import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => 'user/me',
        }),
        getPaymentMethod: builder.query({
            query: () => 'payment_methods',
            keepUnusedDataFor: 180,
        }),
    })
})

export const {
    useGetMeQuery,
    useGetPaymentMethodQuery,
} = extendedApiSlice
