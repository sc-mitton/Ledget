import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Mode = 'light' | 'dark'

interface TAppearance {
  /**
   * The current appearance mode.
   */
  mode: Mode;
  /**
   * The custom appearance mode.
   */
  customMode: Mode;
  /**
   * Whether or not to use the system appearance.
   */
  useDeviceAppearance: boolean;
  /**
   * Set the custom mode.
   */
  setCustomMode: (mode: Mode) => void;
  /**
   * Set whether or not to use the system appearance.
  */
  setUseDeviceApperance: (useCustom: boolean) => void;
}

export const AppearanceContext = createContext<TAppearance | undefined>(undefined);

export const useAppearance = () => {
  const context = useContext(AppearanceContext);

  if (context === undefined) {
    throw new Error('useAppearance must be used within a DarkModeProvider');
  }

  return context;
}

export const AppearanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [useDeviceAppearance, setUseDeviceApperance] = useState<boolean>(true);
  const [customMode, setCustomMode] = useState<Mode>('light');
  const [systemMode, setSystemMode] = useState<Mode>(Appearance.getColorScheme() || 'light');
  const [mode, setMode] = useState<Mode>(useDeviceAppearance ? Appearance.getColorScheme() || 'light' : customMode);

  useEffect(() => {
    const setStoredCustomMode = async () => {
      const storedCustomMode = await AsyncStorage.getItem('customMode');
      if (storedCustomMode) {
        setCustomMode(storedCustomMode as 'light' | 'dark')
        setUseDeviceApperance(false);
      }
    }
    setStoredCustomMode();
  }, []);

  // Track the system appearance
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemMode(colorScheme || 'light');
    });

    return () => listener.remove();
  }, []);

  // Update the appearance with the custom mode if custom mode is enabled
  useEffect(() => {
    useDeviceAppearance ? setMode(systemMode) : setMode(customMode);
  }, [customMode, systemMode, useDeviceAppearance]);

  // Store custom mode in async storage
  useEffect(() => {
    if (!useDeviceAppearance) {
      AsyncStorage.setItem('customMode', customMode);
    }
  }, [customMode, useDeviceAppearance]);

  return (
    <AppearanceContext.Provider value={{ mode, customMode, setCustomMode, useDeviceAppearance, setUseDeviceApperance }}>
      {children}
    </AppearanceContext.Provider>
  );
}
