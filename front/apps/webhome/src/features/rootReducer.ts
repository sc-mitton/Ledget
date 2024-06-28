import { combineReducers } from 'redux';
import { authSlice } from '@features/authSlice';
import { uiSlice } from '@features/uiSlice';
import { modalSlice } from '@features/modalSlice';
import { orySlice } from '@features/orySlice';
import {
  apiSlice,
  toastSlice,
  categorySlice,
  billSlice,
  confirmStack,
  filteredFetchedConfirmedTransactions,
  budgetItemMetaDataSlice,
  remindersApiSlice,
  environmentSlice
} from '@ledget/shared-features';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlice.reducer,
  ui: uiSlice.reducer,
  toast: toastSlice.reducer,
  environment: environmentSlice.reducer,
  categories: categorySlice.reducer,
  bills: billSlice.reducer,
  confirmStack: confirmStack.reducer,
  filteredFetchedonfirmedTransactions:
    filteredFetchedConfirmedTransactions.reducer,
  modal: modalSlice.reducer,
  reminders: remindersApiSlice.reducer,
  budgetItemMetaData: budgetItemMetaDataSlice.reducer,
  ory: orySlice.reducer,
});

export default rootReducer;
