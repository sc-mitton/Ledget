import { apiSlice } from '@api/apiSlice'
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        reAuthedAt: null
    },
    reducers: {
        resetAuthedAt: (state) => {
            state.reAuthedAt = Date.now()
        }
    }
})
export const { resetAuthedAt } = userSlice.actions
export const userReducer = userSlice.reducer

// reauth is fresh if it happened less than 9 minutes ago
// (subtracted 1 min to be safe)
export const selectSessionIsFresh = (state) => {
    return state.user.reAuthedAt && Date.now() - state.user.reAuthedAt < 9 * 60 * 1000
}

export const extendedApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
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
                method: cancelAtPeriodEnd ? 'DELETE' : 'POST',
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
        }),
        addRememberedDevice: builder.mutation({
            query: ({ data }) => ({
                url: 'device',
                method: 'POST',
                body: data,
            })
        }),
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
    useUpdateSubscriptionItemsMutation,
} = extendedApiSlice
