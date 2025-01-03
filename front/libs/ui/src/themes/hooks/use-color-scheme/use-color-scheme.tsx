import { useState, useEffect, useCallback } from 'react';
import { createContext, useContext } from 'react';

interface UseColorScheme {
  isDark: boolean;
  setDarkMode: (mode: boolean) => void;
}

const ColorModeContext = createContext<UseColorScheme | null>(null);

export function useColorScheme(): UseColorScheme {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
}

export const ColorSchemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDark, setIsDark] = useState(false);
  const isDarkModeMediaQuery = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  useEffect(() => {
    const persistedColorScheme = localStorage.getItem('color-scheme');
    if (persistedColorScheme) {
      setIsDark(persistedColorScheme === 'dark');
    } else {
      setIsDark(isDarkModeMediaQuery);
    }
  }, [isDarkModeMediaQuery]);

  const setDarkMode = useCallback((mode: boolean) => {
    localStorage.setItem('color-scheme', mode ? 'dark' : 'light');
    setIsDark(mode);
  }, []);

  return (
    <ColorModeContext.Provider value={{ isDark, setDarkMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};
