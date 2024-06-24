import { useCallback } from 'react';

import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@shopify/restyle';
import { useFonts } from 'expo-font';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

import { styles } from './Styles';
import { darkTheme, lightTheme, AppearanceProvider, useAppearance } from '@theme'
import { Box } from '@components';
import { Budget, Accounts } from '@screens';
import Nav from './Nav';
import SourceSans3Regular from '../../assets/fonts/SourceSans3Regular.ttf';
import SourceSans3Medium from '../../assets/fonts/SourceSans3Medium.ttf';
import SourceSans3SemiBold from '../../assets/fonts/SourceSans3SemiBold.ttf';
import SourceSans3Bold from '../../assets/fonts/SourceSans3Bold.ttf';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent'
  }
};

function App() {
  const { mode } = useAppearance();

  const [fontsLoaded, fontError] = useFonts({
    'SourceSans3Regular': SourceSans3Regular,
    'SourceSans3Medium': SourceSans3Medium,
    'SourceSans3SemiBold': SourceSans3SemiBold,
    'SourceSans3Bold': SourceSans3Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <StatusBar style="auto" />
      <Box
        backgroundColor={'mainBackground'}
        flex={1}
        flexDirection='column'
        style={styles.main}
        onLayout={onLayoutRootView}
      >
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator initialRouteName='budget' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="budget" component={Budget} />
            <Stack.Screen name="accounts" component={Accounts} />
          </Stack.Navigator>
        </NavigationContainer>
      </Box>
      <Nav />
    </ThemeProvider>
  );
}

export default function EnrichedApp() {
  return (
    <AppearanceProvider>
      <App />
    </AppearanceProvider>
  )
}
