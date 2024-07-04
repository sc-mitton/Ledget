import apiSlice from '../apiSlice/slice';

const apiWithTags = apiSlice.enhanceEndpoints({
  addTagTypes: ['devices', 'user', 'payment_method', 'invoice']
});
import {
  Device,
  PaymentMethod,
  Subscription,
  UpdatePaymentMethod,
  UpdateSubscription,
  User,
  NextInvoice,
  Settings
} from './types';

export const userSlice = apiWithTags.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<Device, void>({
      query: () => 'devices',
      providesTags: ['Device']
    }),
    getMe: builder.query<User, void>({
      query: () => 'user/me',
      providesTags: ['User'],
      extraOptions: {
        maxRetries: 1,
      }
    }),
    getCoOwner: builder.query<User, void>({
      query: () => 'user/co-owner',
      providesTags: ['User']
    }),
    getSubscription: builder.query<Subscription, void>({
      query: () => 'subscription'
    }),
    getPrices: builder.query({
      query: () => 'prices'
    }),
    getPaymentMethod: builder.query<PaymentMethod, void>({
      query: () => 'default-payment-method',
      providesTags: ['payment_method']
    }),
    getSetupIntent: builder.query<{ client_secret: string }, void>({
      query: () => ({
        url: 'setup-intent',
        method: 'GET'
      })
    }),
    getNextInvoice: builder.query<NextInvoice, void>({
      query: () => ({
        url: 'next-invoice',
        method: 'GET'
      }),
      providesTags: ['invoice']
    }),
    updateDefaultPaymentMethod: builder.mutation<any, UpdatePaymentMethod>({
      query: ({ paymentMethodId, oldPaymentMethodId }) => ({
        url: 'default_payment_method',
        method: 'POST',
        body: {
          payment_method_id: paymentMethodId,
          old_payment_method_id: oldPaymentMethodId
        }
      }),
      invalidatesTags: ['payment_method']
    }),
    updateUser: builder.mutation<any, Partial<User>>({
      query: (data) => ({
        url: 'user/me',
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['User']
    }),
    updateUserSettings: builder.mutation<any, Partial<Settings>>({
      query: (data) => ({
        url: 'user/settings',
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['User']
    }),
    emailUser: builder.mutation<any, { issue: string; detail: string }>({
      query: (data) => ({
        url: 'user/email',
        method: 'POST',
        body: data
      })
    }),
    updateRestartSubscription: builder.mutation<any, UpdateSubscription>({
      query: ({ subId, cancelAtPeriodEnd, cancelationReason, feedback }) => ({
        url: `subscription/${subId}`,
        method: cancelAtPeriodEnd ? 'DELETE' : 'PATCH',
        body: {
          cancel_at_period_end: cancelAtPeriodEnd,
          cancelation_reason: cancelationReason,
          feedback: feedback
        }
      }),
      invalidatesTags: ['user']
    }),
    updateSubscriptionItems: builder.mutation<any, { priceId: string }>({
      query: ({ priceId }) => ({
        url: 'subscription-item',
        method: 'PUT',
        body: { price: priceId }
      }),
      invalidatesTags: ['invoice']
    }),
    extendSession: builder.mutation<any, void>({
      query: () => ({
        url: 'user/session/extend',
        method: 'PATCH'
      }),
      invalidatesTags: ['user']
    }),
    addUserToAccount: builder.mutation<
      { recovery_link: string; recovery_link_qr: string; expires_at: string },
      { email: string }
    >({
      query: ({ email }) => ({
        url: 'user/account',
        method: 'POST',
        body: { email }
      })
    }),
    delteCoOwner: builder.mutation<any, void>({
      query: () => ({
        url: 'user/co-owner',
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    })
  })
});

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
  useUpdateUserSettingsMutation
} = userSlice;
