import { combineReducers } from 'redux';
import {
  apiSlice,
  environmentSlice,
  mobileAuthSlice,
} from '@ledget/shared-features';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  environment: environmentSlice.reducer,
  mobileAuth: mobileAuthSlice.reducer,
});

export default rootReducer;
