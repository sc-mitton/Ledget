import { combineReducers } from 'redux';
import { createMigrate, persistReducer } from 'redux-persist';

import { appearanceslice } from './appearanceSlice';
import { bioSlice } from './bioSlice';
import { authSlice } from './authSlice';
import { uiSlice } from './uiSlice';
import {
  apiSlice,
  toastSlice,
  confirmStack,
  filteredFetchedConfirmedTransactions,
  budgetItemMetaDataSlice,
  environmentSlice,
  institutionsSlice,
  mobileAuthSlice,
  budgetItemOrderSlice,
  homePageSlice,
} from '@ledget/shared-features';
import storage from './storage';
import { RootState } from './store';

const migrations = {
  1: (state: RootState) => ({
    ...state,
    ui: {
      ...state.ui,
      settings: {
        startOnHome: true,
      },
    },
  }),
  2: (state: RootState) => ({
    ...state,
    ui: {
      ...state.ui,
      hideBottomTabs: false,
    },
  }),
  3: (state: RootState) => ({
    ...state,
    ui: state.ui,
  }),
} as any;

const persistConfig = {
  key: 'root',
  version: 3,
  storage,
  timeout: 0,
  migrate: createMigrate(migrations),
  whitelist: [
    'appearance',
    'budgetItemMetaData',
    'ui',
    'investments',
    'institutions',
    'homePage',
  ],
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  toast: toastSlice.reducer,
  environment: environmentSlice.reducer,
  confirmStack: confirmStack.reducer,
  filteredFetchedonfirmedTransactions:
    filteredFetchedConfirmedTransactions.reducer,
  budgetItemMetaData: budgetItemMetaDataSlice.reducer,
  appearance: appearanceslice.reducer,
  bio: bioSlice.reducer,
  auth: authSlice.reducer,
  ui: uiSlice.reducer,
  institutions: institutionsSlice.reducer,
  mobileAuth: mobileAuthSlice.reducer,
  budgetItemOrder: budgetItemOrderSlice.reducer,
  homePage: homePageSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
