import rootReducer from '@features/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@ledget/shared-features';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
