import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StateT {
  accounts?: string[];
  pinnedAccounts: string[];
}

const initialState: StateT = { pinnedAccounts: [] };

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
  depositoryAccountsTabSlice.actions;
export const selectAccounts = (state: { depositoryAccountsTab: StateT }) =>
  state.depositoryAccountsTab.accounts;
export const selectPinnedAccounts = (state: {
  depositoryAccountsTab: StateT;
}) => state.depositoryAccountsTab.pinnedAccounts;
