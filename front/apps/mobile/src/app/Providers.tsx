import { Provider as ReduxProvider } from 'react-redux';
import { Appearance } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventProvider } from 'react-native-outside-press';
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import styles from './styles/providers';
import { ThemeProvider as RestyleThemeProvider, ModalPickerProvider } from '@ledget/native-ui';
import { useAppearance, setDeviceMode, selectUseDeviceAppearance } from '@features/appearanceSlice';
import store, { persistor } from '@features/store';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useEffect } from 'react';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent'
  }
};

const ThemeProvider = ({ children }: { children: (({ mode }: { mode: 'light' | 'dark' }) => React.ReactNode) | React.ReactNode }) => {
  const { mode } = useAppearance();
  const dispatch = useAppDispatch();
  const useDeviceAppearance = useAppSelector(selectUseDeviceAppearance);

  // This effect makes sure things like the keyboard match the appearance of the app
  useEffect(() => {
    // Add listener to change the appearance of the app
    const appearanceListener = () => {
      setTimeout(() => {
        if (!useDeviceAppearance) {
          Appearance.setColorScheme(mode);
        } else {
          Appearance.setColorScheme(null);
        }
      }, 2000);
    }

    const listener = Appearance.addChangeListener(appearanceListener);

    return () => {
      listener.remove();
    };
  }, [mode]);

  useEffect(() => {
    if (!useDeviceAppearance) {
      Appearance.setColorScheme(null);
    }
  }, [useDeviceAppearance]);

  // Track the device appearance in the redux store
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
      <EventProvider style={styles.fullWidth}>
        <ThemeProvider>
          <GestureHandlerRootView>
            <NavigationContainer theme={navTheme}>
              <ModalPickerProvider>
                <App />
              </ModalPickerProvider>
            </NavigationContainer>
          </GestureHandlerRootView>
        </ThemeProvider>
      </EventProvider>
    </PersistGate>
  </ReduxProvider>
);
