import { Provider as ReduxProvider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventProvider } from 'react-native-outside-press';

import { AppearanceProvider, ThemeProvider } from '@ledget/native-ui';
import store from '@features/store';

export const withProviders = (App: React.FC) => () => (
  <ReduxProvider store={store}>
    <EventProvider>
      <AppearanceProvider>
        {({ mode }) => (
          <ThemeProvider mode={mode}>
            <GestureHandlerRootView>
              <App />
            </GestureHandlerRootView>
          </ThemeProvider>
        )}
      </AppearanceProvider>
    </EventProvider>
  </ReduxProvider>
);
