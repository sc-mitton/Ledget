import { apiSlice } from '@api/apiSlice'

const apiWithTags = apiSlice.enhanceEndpoints({
    addTagTypes: ['devices', 'user', 'payment_method', 'invoice'],
})


type SubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'deleted'

type AuthMethod = 'password' | 'oidc' | 'totp' | 'webauthn' | 'lookup_secret' | 'link_recovery' | 'code_recovery' | 'code'

interface Session {
    aal: 'aal1' | 'aal15' | 'aal2',
    auth_methods: AuthMethod[],
}

interface Account {
    has_customer: boolean,
    service_provisioned_until: number,
    subscription_status: SubscriptionStatus,
}

interface Settings {
    mfa_method: null | 'totp'
    mfa_enabled_on: string | null,
    automatic_logout: boolean,
}

export interface User {
    id: string,
    password_last_changed: string,
    last_login: string,
    created_on: string,
    settings: Settings,
    is_verified: boolean,
    is_onboarded: boolean,
    highest_aal: 'aal1' | 'aal15' | 'aal2',
    session: Session,
    email: string,
    name: {
        first: string,
        last: string,
    }
    co_owner: string | null,
    account: Account,
    is_account_owner: boolean,
    yearly_anchor?: string,
}

export interface CoOwner {
    email: string,
    name: {
        first: string,
        last: string,
    }
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
    current_device: boolean,
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
            providesTags: ['User'],
            extraOptions: {
                maxRetries: 1,
            },
        }),
        getCoOwner: builder.query<User, void>({
            query: () => 'user/co-owner',
            providesTags: ['User'],
        }),
        getSubscription: builder.query<Subscription, void>({
            query: () => 'subscription',
        }),
        getPrices: builder.query({
            query: () => 'prices'
        }),
        getPaymentMethod: builder.query<PaymentMethod, void>({
            query: () => 'default-payment-method',
            providesTags: ['payment_method'],
        }),
        getSetupIntent: builder.query<{ client_secret: string }, void>({
            query: () => ({
                url: 'setup-intent',
                method: 'GET',
            })
        }),
        getNextInvoice: builder.query<NextInvoice, void>({
            query: () => ({
                url: 'next-invoice',
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
        updateUserSettings: builder.mutation<any, Partial<Settings>>({
            query: (data) => ({
                url: 'user/settings',
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
        updateRestartSubscription: builder.mutation<any, UpdateSubscription>({
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
                url: 'subscription-item',
                method: 'PUT',
                body: { price: priceId },
            }),
            invalidatesTags: ['invoice'],
        }),
        extendSession: builder.mutation<any, void>({
            query: () => ({
                url: 'user/session/extend',
                method: 'PATCH',
            }),
            invalidatesTags: ['user'],
        }),
        addUserToAccount: builder.mutation<{ recovery_link: string, recovery_link_qr: string, expires_at: string }, { email: string }>({
            query: ({ email }) => ({
                url: 'user/account',
                method: 'POST',
                body: { email }
            })
        }),
        delteCoOwner: builder.mutation<any, void>({
            query: () => ({
                url: 'user/co-owner',
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
    })
})

export const {
    useGetMeQuery,
    useGetCoOwnerQuery,
    useGetDevicesQuery,
    useGetSubscriptionQuery,
    useGetPaymentMethodQuery,
    useGetNextInvoiceQuery,
    useUpdateUserMutation,
    useLazyGetSetupIntentQuery,
    useUpdateDefaultPaymentMethodMutation,
    useUpdateRestartSubscriptionMutation,
    useGetPricesQuery,
    useUpdateSubscriptionItemsMutation,
    useEmailUserMutation,
    useExtendSessionMutation,
    useAddUserToAccountMutation,
    useDelteCoOwnerMutation,
    useUpdateUserSettingsMutation,
} = extendedApiSlice
