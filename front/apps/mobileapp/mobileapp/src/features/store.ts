import rootReducer from '@features/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@ledget/shared-features';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: false,
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers.concat(devToolsEnhancer()),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
