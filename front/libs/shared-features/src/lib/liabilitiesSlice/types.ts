export type StudentLoan = {
  account_id: string;
  type: string;
  subtype: string;
  institution: {
    name: string;
    id: string;
    primary_color: string;
  },
  name: string;
  product_not_supported: boolean;
  account_number: string;
  disbursement_dates: string[];
  expected_payoff_date: string;
  guarantor: string;
  interest_rate_percentage: number;
  is_overdue: boolean;
  last_payment_amount: number;
  last_payment_date: string;
  last_statement_balance: number;
  last_statement_issue_date: string;
  loan_name: string;
  loan_status: Record<string, any>;
  minimum_payment_amount: number;
  next_payment_due_date: string;
  origination_date: string;
  origination_principal_amount: number;
  outstanding_interest_amount: number;
  payment_reference_number: string;
  pslf_status: Record<string, any>;
  repayment_plan: Record<string, any>;
  sequence_number: string;
  servicer_address: Record<string, any>;
  ytd_interest_paid: number;
  ytd_principal_paid: number;
};

export type Mortgage = {
  account_id: string;
  type: string;
  subtype: string;
  institution: {
    name: string;
    id: string;
    primary_color: string;
  },
  name: string;
  product_not_supported: boolean;
  account_number: string;
  disbursement_dates: string[];
  expected_payoff_date: string;
  guarantor: string;
  interest_rate_percentage: number;
  is_overdue: boolean;
  last_payment_amount: number;
  last_payment_date: string;
  last_statement_balance: number;
  last_statement_issue_date: string;
  loan_name: string;
  loan_status: Record<string, any>;
  minimum_payment_amount: number;
  next_payment_due_date: string;
  origination_date: string;
  origination_principal_amount: number;
  outstanding_interest_amount: number;
  payment_reference_number: string;
  pslf_status: Record<string, any>;
  repayment_plan: Record<string, any>;
  sequence_number: string;
  servicer_address: Record<string, any>;
  ytd_interest_paid: number;
  ytd_principal_paid: number;
};

export type Liabilities = {
  student: StudentLoan[];
  mortgage: Mortgage[];
};
