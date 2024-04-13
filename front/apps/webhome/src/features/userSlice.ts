import { apiSlice } from '@api/apiSlice'

const apiWithTags = apiSlice.enhanceEndpoints({
    addTagTypes: ['devices', 'user', 'payment_method', 'invoice'],
})


type SubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'deleted'

type AuthMethod = 'password' | 'oidc' | 'totp' | 'webauthn' | 'lookup_secret' | 'link_recovery' | 'code_recovery' | 'code'

export interface User {
    password_last_changed: string,
    last_login: string,
    created_on: string,
    mfa_method: null | 'totp'
    mfa_enabled_on: string | null,
    phone_number: string | null,
    phone_country_code: string | null,
    account_flag: string | null,
    is_customer: boolean,
    is_verified: boolean,
    is_onboarded: boolean,
    service_provisioned_until: number,
    session_aal: 'aal1' | 'aal15' | 'aal2',
    highest_aal: 'aal1' | 'aal15' | 'aal2',
    session_auth_methods: AuthMethod[],
    subscription_status: SubscriptionStatus,
    email: string,
    name: {
        first: string,
        last: string,
    }
    [key: string]: any,
}

export interface Device {
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

export interface Subscription {
    id: string,
    status: SubscriptionStatus,
    current_period_end: number,
    cancel_at_period_end: boolean,
    plan: {
        id: string,
        amount: number,
        nickname: 'Month' | 'Year',
        interval: 'month' | 'year',
    }
}

interface NextInvoice {
    next_payment: number
    next_payment_date: number
    balance: number
}

interface PaymentMethod {
    id: string
    brand: string
    exp_month: number
    exp_year: number
    last4: string
}

interface UpdatePaymentMethod {
    paymentMethodId: string
    oldPaymentMethodId: string
}

interface UpdateSubscription {
    subId: string
    cancelAtPeriodEnd: boolean
    cancelationReason?: string
    feedback?: string
}


export const extendedApiSlice = apiWithTags.injectEndpoints({

    endpoints: (builder) => ({
        getDevices: builder.query<Device, void>({
            query: () => 'devices',
            providesTags: ['Device'],
        }),
        getMe: builder.query<User, void>({
            query: () => 'user/me',
            providesTags: ['User']
        }),
        getSubscription: builder.query<Subscription, void>({
            query: () => 'subscription',
        }),
        getPrices: builder.query({
            query: () => 'prices'
        }),
        getPaymentMethod: builder.query<PaymentMethod, void>({
            query: () => 'default_payment_method',
            providesTags: ['payment_method'],
        }),
        getSetupIntent: builder.query<{ client_secret: string }, void>({
            query: () => ({
                url: 'setup_intent',
                method: 'GET',
            })
        }),
        getNextInvoice: builder.query<NextInvoice, void>({
            query: () => ({
                url: 'next_invoice',
                method: 'GET',
            }),
            providesTags: ['invoice'],
        }),
        updateDefaultPaymentMethod: builder.mutation<any, UpdatePaymentMethod>({
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
        updateUser: builder.mutation<any, Partial<User>>({
            query: (data) => ({
                url: 'user/me',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        emailUser: builder.mutation<any, { issue: string, detail: string }>({
            query: (data) => ({
                url: 'user/email',
                method: 'POST',
                body: data,
            }),
        }),
        updateSubscription: builder.mutation<any, UpdateSubscription>({
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
        updateSubscriptionItems: builder.mutation<any, { priceId: string }>({
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
    useGetDevicesQuery,
    useGetSubscriptionQuery,
    useGetPaymentMethodQuery,
    useGetNextInvoiceQuery,
    useUpdateUserMutation,
    useLazyGetSetupIntentQuery,
    useUpdateDefaultPaymentMethodMutation,
    useUpdateSubscriptionMutation,
    useGetPricesQuery,
    useUpdateSubscriptionItemsMutation,
    useEmailUserMutation,
} = extendedApiSlice
