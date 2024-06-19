import { combineReducers } from 'redux';
import { authSlice } from '@features/authSlice';
import { uiSlice } from './uiSlice';
import { modalSlice } from './modalSlice';
import {
  apiSlice,
  toastSlice,
  categorySlice,
  billSlice,
  confirmStack,
  filteredFetchedConfirmedTransactions,
  budgetItemMetaDataSlice,
  remindersApiSlice
} from '@ledget/shared-features';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlice.reducer,
  ui: uiSlice.reducer,
  toast: toastSlice.reducer,
  categories: categorySlice.reducer,
  bills: billSlice.reducer,
  confirmStack: confirmStack.reducer,
  filteredFetchedonfirmedTransactions:
    filteredFetchedConfirmedTransactions.reducer,
  modal: modalSlice.reducer,
  reminders: remindersApiSlice.reducer,
  budgetItemMetaData: budgetItemMetaDataSlice.reducer
});

export default rootReducer;
