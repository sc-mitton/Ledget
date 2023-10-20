import { apiSlice } from '@api/apiSlice'

const apiWithTags = apiSlice.enhanceEndpoints({
    addTagTypes: ['devices', 'user', 'payment_method', 'invoice'],
})

interface User {
    password_last_changed: string,
    last_login: string,
    created_on: string,
    mfa_method: null | 'totp' | 'otp'
    mfa_enabled_on: string | null,
    phone_number: string | null,
    phone_country_code: string | null,
    account_flag: string | null,
    is_customer: boolean,
    is_verified: boolean,
    service_provisioned_until: number,
    session_aal: 'aal1' | 'aal15' | 'aal2',
    highest_aal: 'aal1' | 'aal15' | 'aal2',
    subscription_status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'deleted',
    email: string,
    name: {
        first: string,
        last: string,
    }
    [key: string]: any,
}

interface Device {
    id: string,
    location: string,
    aal: string,
    last_login: string,
    browser_family: string | null,
    browser_version: string | null,
    os_family: string | null,
    os_version: string | null,
    device_family: string | null,
    device_brand: string | null,
    device_model: string | null,
    is_mobile: boolean,
    is_pc: boolean,
    is_tablet: boolean,
    is_touch_capable: boolean,
    is_bot: boolean,
    [key: string]: any,
}


export const extendedApiSlice = apiWithTags.injectEndpoints({

    endpoints: (builder) => ({
        getDevices: builder.query<Device, void>({
            query: () => 'devices',
            providesTags: ['devices'],
        }),
        getMe: builder.query<User, void>({
            query: () => 'user/me',
            providesTags: ['user']
        }),
        getSubscription: builder.query({
            query: () => 'subscription',
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
    useGetSubscriptionQuery,
    useGetPaymentMethodQuery,
    useGetNextInvoiceQuery,
    useUpdateUserMutation,
    useLazyGetSetupIntentQuery,
    useUpdateDefaultPaymentMethodMutation,
    useUpdateSubscriptionMutation,
    useGetPricesQuery,
    useUpdateSubscriptionItemsMutation
} = extendedApiSlice
