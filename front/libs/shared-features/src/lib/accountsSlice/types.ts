import { Institution } from '../plaidSlice/types';

export type AccountType =
  | 'depository'
  | 'credit'
  | 'loan'
  | 'investment'
  | 'other';

export interface Account {
  id: string;
  balances: {
    available: number;
    current: number;
    limit: number;
    iso_currency_code: string;
  };
  unofficial_currency_code: string;
  mask: string;
  name: string;
  official_name?: string;
  type: AccountType;
  subtype: string;
  institution_id: string;
  card_hue?: number;
  pinned: number | null;
}

export type UpdateAccount =
  | ({ order: number } & { account: string })
  | ({ card_hue: number } & { account: string })
  | ({ pinned: number | null } & { account: string });

export interface GetAccountsResponse {
  institutions: Institution[];
  accounts: Account[];
}

export interface GetAccountBalanceHistoryParams {
  start: number;
  end: number;
  type: 'depository' | 'investment';
  accounts?: string[];
}

export interface GetAccountBalanceTrendParams
  extends Omit<GetAccountBalanceHistoryParams, 'start' | 'end'> {
  days?: number;
}

type BalanceTrend = {
  trend: number;
  date: string;
  account: string;
};

type AccountBalance = {
  account_id: string;
  history: {
    month: string;
    balance: number;
  }[];
};

export type GetAccountBalanceTrendResponse = {
  days: number;
  trends: BalanceTrend[];
};

export type GetBalanceHistoryResponse = AccountBalance[];

export type GetBreakdownHistoryResponse = {
  date: string;
  spending: number;
  income: number;
  investment_transfer_out: number;
}[];
