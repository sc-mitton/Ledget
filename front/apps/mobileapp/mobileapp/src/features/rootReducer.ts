import { combineReducers } from 'redux';
import {
  apiSlice,
  toastSlice,
  categorySlice,
  billSlice,
  confirmStack,
  filteredFetchedConfirmedTransactions,
  budgetItemMetaDataSlice,
  remindersApiSlice,
  environmentSlice,
  orySlice
} from '@ledget/shared-features';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  toast: toastSlice.reducer,
  environment: environmentSlice.reducer,
  categories: categorySlice.reducer,
  bills: billSlice.reducer,
  confirmStack: confirmStack.reducer,
  filteredFetchedonfirmedTransactions:
    filteredFetchedConfirmedTransactions.reducer,
  reminders: remindersApiSlice.reducer,
  budgetItemMetaData: budgetItemMetaDataSlice.reducer,
  ory: orySlice.reducer
});

export default rootReducer;
