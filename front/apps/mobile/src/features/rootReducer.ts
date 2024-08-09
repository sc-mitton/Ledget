import { combineReducers } from 'redux';
import { modalSlice } from './modalSlice';
import { appearanceslice } from './appearanceSlice';
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
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  toast: toastSlice.reducer,
  environment: environmentSlice.reducer,
  confirmStack: confirmStack.reducer,
  filteredFetchedonfirmedTransactions:
    filteredFetchedConfirmedTransactions.reducer,
  budgetItemMetaData: budgetItemMetaDataSlice.reducer,
  modal: modalSlice.reducer,
  appearance: appearanceslice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
