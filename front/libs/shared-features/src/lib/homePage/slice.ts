import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '../accountsSlice/types';

type HomePageState = {
  pinnedCategories: string[];
  pinnedAccounts: Account[];
};

type RootStateWithHomePage = {
  homePage: HomePageState;
};

const initialState: HomePageState = {
  pinnedCategories: [],
  pinnedAccounts: [],
};

export const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    addHomePinnedCategory: (state, action: PayloadAction<string>) => {
      state.pinnedCategories.push(action.payload);
    },
    removeHomePinnedCategory: (state, action: PayloadAction<string>) => {
      state.pinnedCategories = state.pinnedCategories.filter(
        (category) => category !== action.payload
      );
    },
    setHomePinnedCategories: (state, action: PayloadAction<string[]>) => {
      state.pinnedCategories = action.payload;
    },
    addHomePinnedAccount: (state, action: PayloadAction<Account>) => {
      state.pinnedAccounts.push(action.payload);
    },
    removeHomePinnedAccount: (state, action: PayloadAction<string>) => {
      state.pinnedAccounts = state.pinnedAccounts.filter(
        (account) => account.id !== action.payload
      );
    },
    setHomePinnedAccounts: (state, action: PayloadAction<Account[]>) => {
      state.pinnedAccounts = action.payload;
    },
  },
});

export const selectPinnedCategories = (state: RootStateWithHomePage) =>
  state.homePage.pinnedCategories;

export const selectHomePinnedAccounts = (state: RootStateWithHomePage) =>
  state.homePage.pinnedAccounts;

export const {
  addHomePinnedCategory,
  removeHomePinnedCategory,
  setHomePinnedCategories,
  addHomePinnedAccount,
  removeHomePinnedAccount,
  setHomePinnedAccounts,
} = homePageSlice.actions;
