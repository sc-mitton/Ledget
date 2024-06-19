export interface Alert {
  percent_amount: number;
}

export interface Category {
  id: string;
  period: 'year' | 'month';
  name: string;
  created: string;
  emoji?: string | null;
  limit_amount: number;
  amount_spent: number;
  alerts: Alert[];
  is_default: boolean;
  has_transactions: boolean;
  order?: number;
}

export type NewCategory = Partial<Pick<Category, 'alerts' | 'emoji' | 'id'>> &
  Pick<Category, 'name' | 'limit_amount' | 'period'>;
export type UpdateCategory = NewCategory & Pick<Category, 'id'>;

export interface SplitCategory extends Category {
  fraction: number;
}

export interface CategoryQueryParams {
  month?: number;
  year?: number;
  spending?: boolean;
  start?: number;
  end?: number;
}

export interface CategorySpendingHistory {
  month: number;
  year: number;
  amount_spent: number;
}
