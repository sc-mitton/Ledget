import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BudgetItemOrderStateT, OrderOptionT } from './types';

const initialState: BudgetItemOrderStateT = {
  billOrder: 'default',
  categoryOrder: 'default',
};

export const budgetItemOrderSlice = createSlice({
  name: 'budgetItemOrder',
  initialState,
  reducers: {
    setBillOrder: (state, action: PayloadAction<OrderOptionT>) => {
      state.billOrder = action.payload;
    },
    setCategoryOrder: (state, action: PayloadAction<OrderOptionT>) => {
      state.categoryOrder = action.payload;
    },
    setBillCatOrder: (state, action: PayloadAction<OrderOptionT>) => {
      state.categoryOrder = action.payload;
      state.billOrder = action.payload;
    },
  },
});

export const { setBillOrder, setCategoryOrder, setBillCatOrder } =
  budgetItemOrderSlice.actions;

export const selectCategoryOrder = (state: {
  budgetItemOrder: BudgetItemOrderStateT;
}) => state.budgetItemOrder.categoryOrder;
export const selectBillOrder = (state: {
  budgetItemOrder: BudgetItemOrderStateT;
}) => state.budgetItemOrder.billOrder;
export const selectBillCatOrder = (state: {
  budgetItemOrder: BudgetItemOrderStateT;
}) => state.budgetItemOrder.categoryOrder;
