export const OrderOptions = [
  'amountDesc',
  'amountAsc',
  'nameDesc',
  'nameAsc',
  'default',
] as const;

export type OrderOptionT = (typeof OrderOptions)[number];

export type BudgetItemOrderStateT = {
  billOrder: OrderOptionT;
  categoryOrder: OrderOptionT;
};
