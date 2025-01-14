import { combineReducers } from 'redux';
import { authSlice } from '@features/authSlice';
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
} from '@ledget/shared-features';

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
});

export default rootReducer;
