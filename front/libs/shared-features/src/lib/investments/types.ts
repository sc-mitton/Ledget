type Security = {
  name?: string | null;
  ticker_symbol?: string | null;
  security_id: string;
};

export type Holding = {
  cost_basis?: number;
  institution_price?: number;
  institution_value?: number;
  quantity?: number;
  vested_quantity?: number;
  vested_value?: number;
  security_id?: string;
  security: Security;
};

export type InvestmentTransaction = {
  amount?: number;
  price?: number;
  quantity?: number;
  type?: string;
  subtype?: string;
  date?: string;
  fees?: number;
  name: string | null;
  security_id?: string;
  security: Security;
};

export type InvestmentWithProductSupport = {
  account_name: string;
  balance: number;
  securities: Security[];
  holdings: Holding[];
  transactions: InvestmentTransaction[];
  account_id: string;
};

type InvestmentWithoutProductSupport = {
  account_id: string;
  product_not_supported: boolean;
};

export type Investment =
  | InvestmentWithProductSupport
  | InvestmentWithoutProductSupport;

export function isInvestmentSupported(
  obj: any
): obj is InvestmentWithProductSupport {
  return !('product_not_supported' in obj);
}

export type InvestmentsResponse = {
  cursor?: string;
  results: Investment[];
};

export type InvestmentsBalanceHistory = {
  account: string;
  account_name: string;
  date: string;
  value: number;
}[];

export type TransformedInvestmentsBalanceHistory = {
  account_id: string;
  balances: {
    date: string;
    value: number;
  }[];
}[];

export type PinnedHolding = { id: string; security_id: string };

export type InvestmentsState = {
  holdingsHistory: {
    [key: string]: { institution_value: number; date: string }[];
  };
  pinnedHoldings?: PinnedHolding[];
};

export type GetInvestmentsQuery = {
  start: string;
  end: string;
  cursor?: string;
} | void;

export type InvestmentsBalanceQuery = {
  start: string;
  end: string;
  accounts?: string[];
};
