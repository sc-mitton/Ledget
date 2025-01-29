import rootReducer from '@features/rootReducer';
import { persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';

import { apiSlice, toastErrorMiddleware } from '@ledget/shared-features';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([apiSlice.middleware, toastErrorMiddleware]),
});

export default store;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
