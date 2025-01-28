import type { Bill } from '../billSlice/types';
import type { AccountType } from '../accountsSlice/types';
import { Category, SplitCategory } from '../categorySlice/types';

export type Note = {
  id: string;
  datetime: string;
  text: string;
  is_current_users: boolean;
};

export type Transaction = {
  account: string;
  transaction_id: string;
  transaction_code?: string;
  transaction_type?: string;
  categories?: SplitCategory[];
  bill?: Bill;
  predicted_category?: Category;
  predicted_bill?: Bill;
  detail: 'investment_transfer_out' | 'spending' | 'income' | null;
  name: string;
  preferred_name?: string;
  merchant_name?: string;
  payment_channel?: string;
  pending?: boolean;
  pending_transaction_id?: string;
  amount: number;
  iso_currency_code?: string;
  unnoficial_currency_code?: string;
  check_number?: string;
  date: string;
  datetime: string;
  authorized_date?: string;
  authorized_datetime?: string;
  confirmed_date?: string;
  confirmed_datetime?: string;
  address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  lat?: number;
  lon?: number;
  store_number?: string;
};

export interface GetTransactionsParams {
  type?: AccountType;
  account?: string;
  confirmed?: boolean;
  start?: number;
  end?: number;
  month?: number;
  year?: number;
  limit_amount_lower?: string | number;
  limit_amount_upper?: string | number;
  items?: string[];
  merchants?: string[];
  accounts?: string[];
  category?: string;
  id?: string;

  // Pagination query params
  limit?: number;
  offset?: number;
}

export type GetTransactionsResponse = {
  results: Transaction[];
  next?: number;
  previous?: number;
  limit?: number;
};

export type RecurringTransaction = {
  upper_amount: number;
  transactions: {
    transaction_id: string;
    date: string;
    name: string;
  }[];
} & Pick<Bill, 'day' | 'week' | 'week_day' | 'month' | 'year'> &
  Partial<Pick<Bill, 'period'>>;

export type TransformedRecurringTransaction = RecurringTransaction & {
  name: string;
};

export interface TransactionsSyncResponse {
  added: number;
  modified: number;
  removed: number;
}

export type TransactionsSyncParams =
  | {
      account?: string;
    }
  | {
      item?: string;
    }
  | {
      accounts?: string[];
    }
  | void;

interface SimpleTransaction {
  transaction: Transaction;
  categories?: SplitCategory[];
  bill?: string;
}

export interface QueueItemWithBill extends SimpleTransaction {
  categories?: never;
  bill: string;
}

export interface QueueItemWithCategory extends SimpleTransaction {
  categories?: SplitCategory[];
  bill?: never;
}

export type ConfirmedQueue = (QueueItemWithBill | QueueItemWithCategory)[];

export interface ConfirmStackInitialState extends ConfirmedQueue {
  unconfirmed: Transaction[];
  confirmedQue: ConfirmedQueue;
}

export type ConfirmTransactionParams = {
  transaction_id: Transaction['transaction_id'];
  splits?: {
    category: SplitCategory['id'];
    fraction: SplitCategory['fraction'];
  }[];
  bill?: Bill['id'];
}[];

export type RootStateWithTransactions = {
  confirmStack: ConfirmStackInitialState;
  filteredFetchedonfirmedTransactions: TransactionsFilterState;
  [key: string]: any;
};

export type TransactionsFilter = {
  date_range?: number[];
  limit_amount_lower?: number;
  limit_amount_upper?: number;
  items?: string[];
  accounts?: string[];
  merchants?: string[];
};

export type TransactionsFilterState = {
  filter: TransactionsFilter;
  filtered: Transaction[];
  unfiltered: Transaction[];
};
