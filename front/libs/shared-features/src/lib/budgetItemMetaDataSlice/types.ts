export interface InitialState {
  budgetMonth: number;
  budgetYear: number;

  // Categories
  unsyncedConfirmedSpending: {
    [categoryid: string]: {
      categoryPeriod: 'month' | 'year';
      amount: number;
    };
  };
  categoryMetaData: {
    [key: `${number | string}-${number | string}`]: {
      monthly_spent: number;
      yearly_spent: number;
      limit_amount_monthly: number;
      limit_amount_yearly: number;
      oldest_yearly_category_created: string;
    };
  };

  // Bills
  billIdPeriodMap: { [billId: string]: 'month' | 'year' | 'once' };
  unsyncedConfirmedBills: string[];
  billsMetaData: {
    [key: `${number | string}-${number | string}`]: {
      monthly_bills_paid: number;
      yearly_bills_paid: number;
      number_of_monthly_bills: number;
      number_of_yearly_bills: number;
      monthly_bills_amount_remaining: number;
      yearly_bills_amount_remaining: number;
      total_monthly_bills_amount: number;
      total_yearly_bills_amount: number;
    };
  };
}

export interface RootStateWithMetaData {
  budgetItemMetaData: InitialState;
  [key: string]: any;
}
