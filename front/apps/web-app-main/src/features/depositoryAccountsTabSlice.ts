import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StateT {
  accounts?: string[];
}

const initialState: StateT = {};

export const depositoryAccountsTabSlice = createSlice({
  name: 'depositoryAccountsTab',
  initialState,
  reducers: {
    setAccounts: (
      state,
      action: PayloadAction<string | string[] | undefined>
    ) => {
      if (!action?.payload) return;
      state.accounts = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
    },
  },
});

export const { setAccounts } = depositoryAccountsTabSlice.actions;
export const selectAccounts = (state: { depositoryAccountsTab: StateT }) =>
  state.depositoryAccountsTab.accounts;
