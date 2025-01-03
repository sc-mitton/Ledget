import rootReducer from '@features/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice, toastErrorMiddleware } from '@ledget/shared-features';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([apiSlice.middleware, toastErrorMiddleware]),
});

export default store;
