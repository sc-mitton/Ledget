import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => 'user/me',
            providesTags: ['user'],
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
            query: ({ data, userId }) => ({
                url: `user/${userId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['user'],
        }),
        updateSubscription: builder.mutation({
            query: ({ subId }) => ({
                url: `subscription/${subId}`,
                method: 'POST',
            }),
            invalidatesTags: ['user'],
        }),
        cancelSubscription: builder.mutation({
            query: ({ subId, cancelationReason, feedback }) => ({
                url: `subscription/${subId}`,
                method: 'DELETE',
                body: {
                    cancelation_reason: cancelationReason,
                    feedback: feedback,
                },
            }),
            invalidatesTags: ['user'],
        }),
        createSubscription: builder.mutation({
            query: ({ priceId, billingCycleAnchor }) => ({
                url: 'subscription',
                method: 'POST',
                body: {
                    price_id: priceId,
                    billing_cycle_anchor: billingCycleAnchor,
                },
            }),
            invalidatesTags: ['user'],
        }),
    })
})

export const {
    useGetMeQuery,
    useGetPaymentMethodQuery,
    useUpdateUserMutation,
    useLazyGetSetupIntentQuery,
    useUpdateDefaultPaymentMethodMutation,
    useCancelSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useCreateSubscriptionMutation,
    useGetPricesQuery,
} = extendedApiSlice
