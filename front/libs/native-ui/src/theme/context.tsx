import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';

import { darkTheme } from './dark';
import { lightTheme } from './light';

type Mode = 'light' | 'dark';

export const ThemeProvider = ({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: Mode;
}) => (
  <RestyleThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
    {children}
  </RestyleThemeProvider>
);
