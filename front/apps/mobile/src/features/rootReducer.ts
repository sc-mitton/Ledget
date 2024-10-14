import { combineReducers } from 'redux';
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
} from '@ledget/shared-features';
import { persistReducer } from "redux-persist";
import reduxStorage from "./storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage: reduxStorage,
  timeout: 0,
  whitelist: ['appearance', 'budgetItemMetaData', 'ui']
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
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
