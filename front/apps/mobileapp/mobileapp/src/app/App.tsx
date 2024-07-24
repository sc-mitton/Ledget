import { useCallback, useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as ReduxProvider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';

import styles from './styles/app';
import {
  darkTheme,
  lightTheme,
  AppearanceProvider,
  useAppearance,
  Box
} from '@ledget/native-ui'
import { Budget, Accounts, Profile, Activity } from '@screens';
import { useAppDispatch, useAppSelector } from '@hooks';
import {
  useRefreshDevicesMutation,
  useExtendTokenSessionMutation,
  useGetMeQuery,
  selectEnvironment,
  setEnvironment,
  setSession,
  setDeviceToken,
  selectSession
} from '@ledget/shared-features';
import { hasErrorCode } from '@ledget/helpers';
import { RootTabParamList } from '@types';
import { ENV, LEDGET_API_URI } from '@env';
import store from '@features/store';
import BottomNav from './BottomNav';
import Authentication from './Accounts';
import Modals from './Modals';
import SourceSans3Regular from '../../assets/fonts/SourceSans3Regular.ttf';
import SourceSans3Medium from '../../assets/fonts/SourceSans3Medium.ttf';
import SourceSans3SemiBold from '../../assets/fonts/SourceSans3SemiBold.ttf';
import SourceSans3Bold from '../../assets/fonts/SourceSans3Bold.ttf';

const Tab = createBottomTabNavigator<RootTabParamList>();
SplashScreen.preventAutoHideAsync();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent'
  }
};

function App() {
  const dispatch = useAppDispatch();
  const appearance = useAppearance();
  const [appIsReady, setAppIsReady] = useState(false);
  const [skipGetMe, setSkipGetMe] = useState(true);

  const [fontsLoaded, fontError] = useFonts({
    'SourceSans3Regular': SourceSans3Regular,
    'SourceSans3Medium': SourceSans3Medium,
    'SourceSans3SemiBold': SourceSans3SemiBold,
    'SourceSans3Bold': SourceSans3Bold,
  });

  const {
    isSuccess: isGetMeSuccess,
    isError: isGetMeError,
    error: getMeError,
    isUninitialized: isGetMeUninitialized,
    refetch: refetchGetMe
  } = useGetMeQuery(undefined, { skip: skipGetMe });
  const [
    refreshDevices, {
      isUninitialized: isRefreshDevicesUninitialized,
      isSuccess: isRefreshDevicesSuccess,
      isError: isRefreshDevicesError,
      data: deviceResult
    }] = useRefreshDevicesMutation({ fixedCacheKey: 'refreshDevices' })
  const session = useAppSelector(selectSession);
  const [extendSession, {
    isUninitialized: isUninitializedExtend,
    isSuccess: isExtendSuccess,
    isError: isExtendError,
    error: extendError
  }] = useExtendTokenSessionMutation({ fixedCacheKey: 'extendSession' });

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  //  Set the token from the secure store on app load if it exists
  useEffect(() => {
    SecureStore.getItemAsync('session').then((session) => {
      if (session) {
        const sessionObj = JSON.parse(session);
        dispatch(setSession(sessionObj))
      }
    });
    SecureStore.getItemAsync('device_token').then((token) => {
      if (token) {
        dispatch(setDeviceToken(token))
      }
    });
  }, []);

  // Try to refresh devices when
  // 1. the session is available and the devices haven't been refreshed yet
  // 2. the session is available, just extended successfully, and the devices haven't been refreshed yet
  useEffect(() => {
    if (session && (isRefreshDevicesUninitialized || (isExtendSuccess && !isRefreshDevicesSuccess))) {
      refreshDevices();
    }
  }, [session, isExtendSuccess, isRefreshDevicesSuccess])

  // Try and extend the ef if fetching the user data was unsuccessful
  useEffect(() => {
    if (session && hasErrorCode(401, getMeError) && isUninitializedExtend) {
      extendSession({ session_id: session.id });
    }
  }, [session, getMeError]);

  // Fetch user data after refreshing devices
  useEffect(() => {
    if (isRefreshDevicesSuccess || isRefreshDevicesError) {
      setSkipGetMe(false);
      !isGetMeUninitialized && refetchGetMe();
    }
  }, [isRefreshDevicesSuccess, isRefreshDevicesError]);

  // Checks for when the app is ready to load
  useEffect(() => {
    // Situation 1
    const situation1Checks = [
      fontsLoaded,
      !fontError,
      (isExtendSuccess || isGetMeSuccess)
    ]
    // Situation 2
    const situation2Checks = [
      fontsLoaded,
      !fontError,
      (isGetMeError && isExtendError)
    ]
    if (situation1Checks.every(Boolean)) {
      setAppIsReady(true);
    }
    if (situation2Checks.every(Boolean)) {
      setAppIsReady(true);
    }
    // Situation 3: No session
    if (!SecureStore.getItem('session')) {
      setAppIsReady(true);
    }
  }, [
    fontsLoaded,
    fontError,
    isGetMeError,
    isRefreshDevicesError,
    isGetMeSuccess,
    isRefreshDevicesSuccess
  ]);

  // Store device token on successful device refresh
  useEffect(() => {
    if (deviceResult) {
      dispatch(setDeviceToken(deviceResult.device_token));
      SecureStore.setItemAsync('device_token', deviceResult.device_token);
    }
  }, [deviceResult]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <StatusBar style={appearance.mode === 'dark' ? 'light' : 'dark'} />
      <Modals />
      <Box
        backgroundColor={'mainBackground'}
        style={styles.main}
        onLayout={onLayoutRootView}
      >
        <NavigationContainer theme={navTheme}>
          {isGetMeSuccess && isRefreshDevicesSuccess && !extendError
            ? <Tab.Navigator
              initialRouteName='Budget'
              backBehavior='history'
              screenOptions={{ headerShown: false }}
              tabBar={({ state, descriptors, navigation }) =>
                <BottomNav
                  state={state}
                  descriptors={descriptors}
                  navigation={navigation}
                />}>
              <Tab.Screen name="Home" component={Budget} />
              <Tab.Screen name="Budget" component={Budget} />
              <Tab.Screen name="Activity" component={Activity} />
              <Tab.Screen name="Accounts" component={Accounts} />
              <Tab.Screen name="Profile" component={Profile} />
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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemedApp />
        </GestureHandlerRootView>
      </ReduxProvider>
    </AppearanceProvider>
  )
}
