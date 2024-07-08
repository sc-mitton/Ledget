import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

interface T {
  mode: 'light' | 'dark' | null | undefined;
  setMode: (mode: 'light' | 'dark' | null | undefined) => void;
}

export const AppearanceContext = createContext<T | undefined>(undefined);

export const useAppearance = () => {
  const context = useContext(AppearanceContext);

  if (context === undefined) {
    throw new Error('useAppearance must be used within a DarkModeProvider');
  }

  return context;
}

export const AppearanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setMode(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  return (
    <AppearanceContext.Provider value={{ mode, setMode }}>
      {children}
    </AppearanceContext.Provider>
  );
}
