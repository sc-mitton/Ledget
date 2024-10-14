type Holding = {
  cost_basis?: number;
  institution_price?: number;
  institution_value?: number;
  quantity?: number;
  vested_quantity?: number;
  vested_value?: number;
  security_id?: string;
}

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
}

type Security = {
  name?: string | null;
  ticker_symbol?: string | null;
  security_id: string;
}

type InvestmentWithProductSupport = {
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

type Investment = InvestmentWithProductSupport | InvestmentWithoutProductSupport;

export function isInvestmentSupported(obj: any): obj is InvestmentWithProductSupport {
  return !('product_not_supported' in obj);
}

export type Investments = Investment[]

export type InvestmentsBalanceHistory = {
  account_id: string;
  account_name: string;
  balances: {
    date: string;
    balance: number;
  }[]
}[]
