import { Provider as ReduxProvider } from 'react-redux';
import { Appearance } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventProvider } from 'react-native-outside-press';
import { PersistGate } from "redux-persist/integration/react";

import { ThemeProvider as RestyleThemeProvider, ModalPickerContextProvider } from '@ledget/native-ui';
import { useAppearance, setDeviceMode } from '@features/appearanceSlice';
import store, { persistor } from '@features/store';
import { useAppDispatch } from '@/hooks';
import { useEffect } from 'react';

const ThemeProvider = ({ children }: { children: (({ mode }: { mode: 'light' | 'dark' }) => React.ReactNode) | React.ReactNode }) => {
  const { mode } = useAppearance();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      Appearance.setColorScheme(mode);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [mode]);

  useEffect(() => {
    const appearanceListener = () => {
      const newDeviceMode = Appearance.getColorScheme() || "light";
      dispatch(setDeviceMode(newDeviceMode));
    };
    dispatch(setDeviceMode(Appearance.getColorScheme() || "light"));

    const listener = Appearance.addChangeListener(appearanceListener);
    return () => listener.remove();
  }, []);

  return (
    <RestyleThemeProvider mode={mode}>
      {typeof children === 'function' ? children({ mode }) : children}
    </RestyleThemeProvider>
  )
}

export const withProviders = (App: React.FC) => () => (
  <ReduxProvider store={store}>
    <PersistGate persistor={persistor}>
      <EventProvider>
        <ThemeProvider>
          <GestureHandlerRootView>
            <ModalPickerContextProvider>
              <App />
            </ModalPickerContextProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </EventProvider>
    </PersistGate>
  </ReduxProvider>
);
