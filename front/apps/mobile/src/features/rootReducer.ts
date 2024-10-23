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
  holdingsSlice
} from '@ledget/shared-features';
import { createMigrate, persistReducer } from "redux-persist";
import storage from "./storage";
import { RootState } from './store';

const migrations = {
  1: (state: RootState) => ({
    ...state,
    ui: {
      ...state.ui,
      settings: {
        startOnHome: true
      }
    }
  }),
  2: (state: RootState) => ({
    ...state,
    ui: {
      ...state.ui,
      hideBottomTabs: false
    }
  })
} as any;

const persistConfig = {
  key: "root",
  version: 2,
  storage,
  timeout: 0,
  migrate: createMigrate(migrations),
  whitelist: ['appearance', 'budgetItemMetaData', 'ui', 'holdings', 'widgets']
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
  holdings: holdingsSlice.reducer,
  ui: uiSlice.reducer,
  widgets: widgetsSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
