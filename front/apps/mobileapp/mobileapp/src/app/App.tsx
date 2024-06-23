import { useState, useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';

import { darkTheme, lightTheme } from '@theme'
import { Box } from '@components';
import { styles } from './Styles';

import Nav from './Nav';


export default function App() {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <Box style={styles.container} backgroundColor={'mainBackground'}>
        <StatusBar style="auto" />
        <Nav />
      </Box>
    </ThemeProvider>
  );
}
