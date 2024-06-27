import { useCallback, useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as ReduxProvider } from 'react-redux';
import { selectEnvironment, setEnvironment } from '@ledget/shared-features';
import { ENV } from '@env';
import * as SplashScreen from 'expo-splash-screen';

import styles from './styles/app';
import { darkTheme, lightTheme, AppearanceProvider, useAppearance } from '@theme'
import { Box } from '@components';
import { Budget, Accounts, Profile, Activity } from '@screens';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { useGetMeQuery } from '@ledget/shared-features';
import store from '@features/store';
import Nav from './BottomNav';
import Authentication from './Accounts';
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
  const { data: user } = useGetMeQuery();
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
        style={styles.main}
        onLayout={onLayoutRootView}
      >
        <NavigationContainer theme={navTheme}>
          {user
            ? <Tab.Navigator
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
            : <Authentication />}
        </NavigationContainer>
      </Box>
    </>
  );
}

const AppWithEnvironment = () => {
  const dispatch = useAppDispatch();
  const environment = useAppSelector(selectEnvironment);

  useEffect(() => {
    dispatch(setEnvironment(ENV));
  }, [dispatch]);

  return environment ? <App /> : null;
}

const ThemedApp = () => {
  const { mode } = useAppearance();
  return (
    <RestyleThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <AppWithEnvironment />
    </RestyleThemeProvider>
  )
}

export default function EnrichedApp() {

  return (
    <AppearanceProvider>
      <ReduxProvider store={store}>
        <ThemedApp />
      </ReduxProvider>
    </AppearanceProvider>
  )
}
