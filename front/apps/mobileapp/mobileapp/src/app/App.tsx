import { useCallback, useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as ReduxProvider } from 'react-redux';
import { selectEnvironment, setEnvironment } from '@ledget/shared-features';
import * as SplashScreen from 'expo-splash-screen';
import { ENV } from '@env';

import { styles } from './Styles';
import { darkTheme, lightTheme, AppearanceProvider, useAppearance } from '@theme'
import { Box } from '@components';
import { Budget, Accounts, Profile, Activity } from '@screens';
import { useAppDispatch, useAppSelector } from '@hooks/store';

import store from '@features/store';
import Nav from './BottomNav';
import SourceSans3Regular from '../../assets/fonts/SourceSans3Regular.ttf';
import SourceSans3Medium from '../../assets/fonts/SourceSans3Medium.ttf';
import SourceSans3SemiBold from '../../assets/fonts/SourceSans3SemiBold.ttf';
import SourceSans3Bold from '../../assets/fonts/SourceSans3Bold.ttf';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent'
  }
};

function App() {
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
    <>
      <StatusBar style="auto" />
      <Box
        backgroundColor={'mainBackground'}
        flex={1}
        flexDirection='column'
        style={styles.main}
        onLayout={onLayoutRootView}
      >
        <NavigationContainer theme={navTheme}>
          <Tab.Navigator
            initialRouteName='budget'
            backBehavior='history'
            screenOptions={{ headerShown: false }}
            tabBar={({ state, descriptors, navigation }) =>
              <Nav state={state} descriptors={descriptors} navigation={navigation} />}
          >
            <Tab.Screen name="home" component={Budget} />
            <Tab.Screen name="budget" component={Budget} />
            <Tab.Screen name="activity" component={Activity} />
            <Tab.Screen name="accounts" component={Accounts} />
            <Tab.Screen name="profile" component={Profile} />
          </Tab.Navigator>
        </NavigationContainer>
      </Box>
    </>
  );
}

function EnrichedApp() {
  const { mode } = useAppearance();

  return (
    <AppearanceProvider>
      <ReduxProvider store={store}>
        <RestyleThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
          <App />
        </RestyleThemeProvider>
      </ReduxProvider>
    </AppearanceProvider>
  )
}

export default function () {
  const dispatch = useAppDispatch();
  const environment = useAppSelector(selectEnvironment);

  useEffect(() => {
    dispatch(setEnvironment(ENV));
  }, [dispatch]);

  return environment ? <EnrichedApp /> : null;
}
