export interface Reminder {
  id: string;
  offset: number;
  period: 'day' | 'week';
  active: boolean;
}
