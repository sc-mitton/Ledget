type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'deleted';

type AuthMethod =
  | 'password'
  | 'oidc'
  | 'totp'
  | 'webauthn'
  | 'lookup_secret'
  | 'link_recovery'
  | 'code_recovery'
  | 'code';

interface Session {
  aal: 'aal1' | 'aal15' | 'aal2';
  auth_completed_at: string;
  auth_methods: AuthMethod[];
}

interface Account {
  has_customer: boolean;
  service_provisioned_until: number;
  customer: {
    subscription_status: SubscriptionStatus | null;
    period_end: number;
    id: string;
  };
}

export interface Settings {
  mfa_method: null | 'totp';
  mfa_enabled_on: string | null;
  automatic_logout: boolean;
}

export interface User {
  id: string;
  password_last_changed: string;
  last_login: string;
  created_on: string;
  settings: Settings;
  is_verified: boolean;
  is_onboarded: boolean;
  highest_aal: 'aal1' | 'aal15' | 'aal2';
  session: Session;
  email: string;
  name: {
    first: string;
    last: string;
  };
  co_owner: string | null;
  account: Account;
  is_account_owner: boolean;
  yearly_anchor?: string;
}

export interface CoOwner {
  email: string;
  name: {
    first: string;
    last: string;
  };
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  current_period_end: number;
  cancel_at_period_end: boolean;
  plan: {
    id: string;
    amount: number;
    nickname: 'Month' | 'Year';
    interval: 'month' | 'year';
  };
}

export interface NextInvoice {
  next_payment: number;
  next_payment_date: number;
  balance: number;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  last4: string;
}

export interface UpdatePaymentMethod {
  paymentMethodId: string;
  oldPaymentMethodId: string;
}

export interface UpdateSubscription {
  subId: string;
  cancelAtPeriodEnd: boolean;
  cancelationReason?: string;
  feedback?: string;
}
