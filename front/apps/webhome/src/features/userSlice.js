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
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            apiSlice.endpoints.getMe.matchFulfilled,
            (state, action) => {
                if (Date.now() - Date.parse(action.payload.last_login) < 1000 * 60 * 9) {
                    state.reAuthedAt = Date.now()
                }
            }
        )
    }
})
export const { resetAuthedAt } = userSlice.actions
export const userReducer = userSlice.reducer

// reauth is fresh if it happened less than 9 minutes ago
// (subtracted 1 min to be safe)
export const selectSessionIsFresh = (state) => {
    return state.user.reAuthedAt && Date.now() - state.user.reAuthedAt < 1000 * 60 * 9
}

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
            query: () => ({
                url: 'devices',
                method: 'POST',
            })
        }),
        deleteRememberedDevice: builder.mutation({
            query: ({ deviceId }) => ({
                url: `devices/${deviceId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['devices'],
        }),
        createOtp: builder.mutation({
            query: ({ data }) => ({
                url: 'otp',
                method: 'POST',
                body: data,
            }),
            transformResponse: response => response.data
        }),
        verifyOtp: builder.mutation({
            query: ({ data, id }) => ({
                url: `otp/${id}`,
                method: 'GET',
                body: data,
            }),
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
    useAddRememberedDeviceMutation,
    useGetDevicesQuery,
    useDeleteRememberedDeviceMutation,
    useCreateOtpMutation,
    useVerifyOtpMutation,
} = extendedApiSlice
