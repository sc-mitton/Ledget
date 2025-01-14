import { combineReducers } from 'redux';
import { appearanceslice } from './appearanceSlice';
import { bioSlice } from './bioSlice';
import { authSlice } from './authSlice';
import { uiSlice } from './uiSlice';
import { widgetsSlice } from './widgetsSlice';
import {
  apiSlice,
  toastSlice,
  confirmStack,
  filteredFetchedConfirmedTransactions,
  budgetItemMetaDataSlice,
  environmentSlice,
  investmentsSlice,
  institutionsSlice,
  mobileAuthSlice,
  budgetItemOrderSlice,
} from '@ledget/shared-features';
import { createMigrate, persistReducer } from 'redux-persist';
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
    'widgets',
    'institutions',
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
  investments: investmentsSlice.reducer,
  ui: uiSlice.reducer,
  widgets: widgetsSlice.reducer,
  institutions: institutionsSlice.reducer,
  mobileAuth: mobileAuthSlice.reducer,
  budgetItemOrder: budgetItemOrderSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
