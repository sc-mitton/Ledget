export type AccountType =
  | 'depository'
  | 'credit'
  | 'loan'
  | 'investment'
  | 'other';

export interface Account {
  account_id: string;
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
}

export interface Institution {
  id: string;
  name: string;
  primary_color: string;
  logo: string;
  url: string;
  oath: boolean;
}

export interface UpdateAccount {
  account: string;
  order: number;
  [key: string]: any;
}

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
