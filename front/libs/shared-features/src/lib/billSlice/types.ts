import { Reminder } from '../remindersSlice/types';

export interface Bill {
  id: string;
  is_paid: boolean;
  last_paid?: string;
  period: 'year' | 'month' | 'once';
  name: string;
  created: string;
  emoji?: string;
  lower_amount?: number;
  upper_amount: number;
  bill_confirmed: boolean;
  reminders?: Reminder[];
  day?: number;
  week?: number;
  week_day?: number;
  month?: number;
  year?: number;
  expires?: string;
  transactions?: { date: string, id: string }[];
}

export type NewBill = Omit<
  Partial<Omit<Bill, 'reminders'> & { reminders: Partial<Reminder>[] }>,
  'id' | 'is_paid' | 'last_paid' | 'bill_confirmed'
>;
export type UpdateBill = NewBill & Pick<Bill, 'id'>;

export interface TransformedBill extends Bill {
  date: string;
}

export interface BillQueryParams {
  month?: string | number;
  year?: string | number;
}
