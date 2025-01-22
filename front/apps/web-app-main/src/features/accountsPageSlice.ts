import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StateT {
  accounts?: string[];
  pinnedAccounts: string[];
}

const initialState: StateT = { pinnedAccounts: [] };

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
    setPinnedAccount: (state, action: PayloadAction<string | string[]>) => {
      state.pinnedAccounts = Array.isArray(action.payload)
        ? [...action.payload, ...state.pinnedAccounts].slice(0, 3)
        : [action.payload, ...state.pinnedAccounts].slice(0, 3);
    },
    unPinAccount: (state, action: PayloadAction<string | string[]>) => {
      state.pinnedAccounts = state.pinnedAccounts.filter(
        (a) => a !== action.payload
      );
    },
  },
});

export const { setAccounts, setPinnedAccount, unPinAccount } =
  accountsPageSlice.actions;
export const selectAccounts = (state: { accountsPage: StateT }) =>
  state.accountsPage.accounts;
export const selectPinnedAccounts = (state: { accountsPage: StateT }) =>
  state.accountsPage.pinnedAccounts;
