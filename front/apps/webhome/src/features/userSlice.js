import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getDevices: builder.query({
            query: () => 'devices',
            providesTags: ['devices'],
        }),
        getMe: builder.query({
            query: () => 'user/me',
            providesTags: ['user']
        }),
        getPrices: builder.query({
            query: () => 'prices'
        }),
        getPaymentMethod: builder.query({
            query: () => 'default_payment_method',
            providesTags: ['payment_method'],
        }),
        getSetupIntent: builder.query({
            query: () => ({
                url: 'setup_intent',
                method: 'GET',
            })
        }),
        getNextInvoice: builder.query({
            query: () => ({
                url: 'next_invoice',
                method: 'GET',
            }),
            providesTags: ['invoice'],
        }),
        updateDefaultPaymentMethod: builder.mutation({
            query: ({ paymentMethodId, oldPaymentMethodId }) => ({
                url: 'default_payment_method',
                method: 'POST',
                body: {
                    payment_method_id: paymentMethodId,
                    old_payment_method_id: oldPaymentMethodId,
                },
            }),
            invalidatesTags: ['payment_method'],
        }),
        updateUser: builder.mutation({
            query: ({ data }) => ({
                url: 'user/me',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['user'],
        }),
        updateSubscription: builder.mutation({
            query: ({ subId, cancelAtPeriodEnd, cancelationReason, feedback }) => ({
                url: `subscription/${subId}`,
                method: cancelAtPeriodEnd ? 'DELETE' : 'PATCH',
                body: {
                    cancel_at_period_end: cancelAtPeriodEnd,
                    cancelation_reason: cancelationReason,
                    feedback: feedback,
                },
            }),
            invalidatesTags: ['user'],
        }),
        updateSubscriptionItems: builder.mutation({
            query: ({ priceId }) => ({
                url: 'subscription_item',
                method: 'PUT',
                body: { price: priceId },
            }),
            invalidatesTags: ['invoice'],
        })
    })
})

export const {
    useGetMeQuery,
    useGetPaymentMethodQuery,
    useGetNextInvoiceQuery,
    useUpdateUserMutation,
    useLazyGetSetupIntentQuery,
    useUpdateDefaultPaymentMethodMutation,
    useUpdateSubscriptionMutation,
    useGetPricesQuery,
    useUpdateSubscriptionItemsMutation
} = extendedApiSlice
