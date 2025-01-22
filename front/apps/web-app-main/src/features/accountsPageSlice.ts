import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StateT {
  accounts?: string[];
}

const initialState: StateT = {};

export const accountsPageSlice = createSlice({
  name: 'accountsPage',
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

export const { setAccounts } = accountsPageSlice.actions;
export const selectAccounts = (state: { accountsPage: StateT }) =>
  state.accountsPage.accounts;
