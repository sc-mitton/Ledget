import { useCallback, useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as ReduxProvider } from 'react-redux';
import { ENV, LEDGET_API_URI } from '@env';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';

import styles from './styles/app';
import { darkTheme, lightTheme, AppearanceProvider, useAppearance, Box } from '@ledget/native-ui'
import { Budget, Accounts, Profile, Activity } from '@screens';
import { useAppDispatch, useAppSelector } from '@hooks';
import {
  useGetMeQuery,
  useRefreshDevicesMutation,
  setSessionToken,
  selectEnvironment,
  setEnvironment
} from '@ledget/shared-features';
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
  const dispatch = useAppDispatch();

  const [refreshDevices, { isUninitialized }] = useRefreshDevicesMutation()
  const { data: user } = useGetMeQuery();
  const [fontsLoaded, fontError] = useFonts({
    'SourceSans3Regular': SourceSans3Regular,
    'SourceSans3Medium': SourceSans3Medium,
    'SourceSans3SemiBold': SourceSans3SemiBold,
    'SourceSans3Bold': SourceSans3Bold,
  });

  useEffect(() => {
    if (fontsLoaded && !fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Refresh devices on user verification
  useEffect(() => {
    if (user && user.is_verified && isUninitialized) {
      refreshDevices();
    }
  }, [user]);

  // Set the token from the secure store on app load if it exists
  useEffect(() => {
    SecureStore.getItemAsync('session_token').then((token) => {
      if (token) {
        dispatch(setSessionToken(token))
      }
    });
  }, []);

  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Box
        backgroundColor={'mainBackground'}
        paddingHorizontal='xl'
        style={styles.main}
        onLayout={SplashScreen.preventAutoHideAsync}
      >
        <NavigationContainer theme={navTheme}>
          {(user && user.is_verified)
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
    dispatch(setEnvironment({
      name: ENV,
      apiUrl: LEDGET_API_URI,
      platform: 'mobile'
    }));
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
