import rootReducer from '@features/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice, toastErrorMiddleware } from '@ledget/shared-features';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistStore
} from "redux-persist";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      apiSlice.middleware,
      toastErrorMiddleware
    ]),
  devTools: false,
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers.concat(devToolsEnhancer()),
});

export default store;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
