import { combineReducers } from 'redux';
import { authSlice } from '@features/authSlice';
import { createMigrate, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { uiSlice } from '@features/uiSlice';
import { modalSlice } from '@features/modalSlice';
import {
  apiSlice,
  toastSlice,
  confirmStack,
  filteredFetchedConfirmedTransactions,
  budgetItemMetaDataSlice,
  environmentSlice,
  mobileAuthSlice,
  budgetItemOrderSlice,
  investmentsSlice,
  pinnedAccountsSlice,
} from '@ledget/shared-features';
import { creditCardsTabSlice } from './creditCardsTabSlice';
import { depositoryAccountsTabSlice } from './depositoryAccountsTabSlice';
import { investmentsTabSlice } from './investmentsTabSlice';
import type { RootState } from './store';

const migrations = {
  1: (state: RootState) => ({
    ...state,
  }),
} as any;

const persistConfig = {
  key: 'root',
  version: 3,
  storage,
  timeout: 0,
  migrate: createMigrate(migrations),
  whitelist: [
    'ui',
    'investmentsTab',
    'creditCardsTab',
    'depositoryAccountsTab',
  ],
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlice.reducer,
  ui: uiSlice.reducer,
  toast: toastSlice.reducer,
  environment: environmentSlice.reducer,
  confirmStack: confirmStack.reducer,
  filteredFetchedonfirmedTransactions:
    filteredFetchedConfirmedTransactions.reducer,
  modal: modalSlice.reducer,
  mobileAuth: mobileAuthSlice.reducer,
  budgetItemMetaData: budgetItemMetaDataSlice.reducer,
  budgetItemOrder: budgetItemOrderSlice.reducer,
  depositoryAccountsTab: depositoryAccountsTabSlice.reducer,
  creditCardsTab: creditCardsTabSlice.reducer,
  investmentsTab: investmentsTabSlice.reducer,
  investments: investmentsSlice.reducer,
  pinnedAccounts: pinnedAccountsSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
