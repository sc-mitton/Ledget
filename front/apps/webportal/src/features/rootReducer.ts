import { combineReducers } from 'redux';
import { apiSlice, environmentSlice } from '@ledget/shared-features';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  environment: environmentSlice.reducer,
});

export default rootReducer;
