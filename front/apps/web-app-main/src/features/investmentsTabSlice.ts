import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StateT {
  accounts?: { id: string; name: string }[];
  window?: {
    period: 'month' | 'year';
    amount: number;
  };
}

const initialState: StateT = {};

export const investmentsTabSlice = createSlice({
  name: 'investmentsTab',
  initialState,
  reducers: {
    setInvestmentsScreenAccounts: (
      state,
      action: PayloadAction<StateT['accounts']>
    ) => {
      state.accounts = action.payload;
    },
    setInvestmentsScreenWindow: (
      state,
      action: PayloadAction<StateT['window']>
    ) => {
      state.window = action.payload;
    },
  },
});

export const { setInvestmentsScreenAccounts, setInvestmentsScreenWindow } =
  investmentsTabSlice.actions;
export const selectAccounts = (state: { investmentsTab: StateT }) =>
  state.investmentsTab.accounts;
export const selectWindow = (state: { investmentsTab: StateT }) =>
  state.investmentsTab.window;
