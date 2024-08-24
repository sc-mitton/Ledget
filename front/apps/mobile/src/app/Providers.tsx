import { Provider as ReduxProvider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventProvider } from 'react-native-outside-press';
import { PersistGate } from "redux-persist/integration/react";

import { ThemeProvider as RestyleThemeProvider } from '@ledget/native-ui';
import { useAppearance } from '@features/appearanceSlice';
import store, { persistor } from '@features/store';

const ThemeProvider = ({ children }: { children: ({ mode }: { mode: 'light' | 'dark' }) => React.ReactNode }) => {
  const { mode } = useAppearance();
  return (
    <RestyleThemeProvider mode={mode}>
      {children({ mode })}
    </RestyleThemeProvider>
  )
}

export const withProviders = (App: React.FC) => () => (
  <ReduxProvider store={store}>
    <PersistGate persistor={persistor}>
      <EventProvider>
        <ThemeProvider>
          {({ mode }) => (
            <GestureHandlerRootView>
              <App />
            </GestureHandlerRootView>
          )}
        </ThemeProvider>
      </EventProvider>
    </PersistGate>
  </ReduxProvider>
);
