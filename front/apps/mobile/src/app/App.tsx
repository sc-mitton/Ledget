import { useCallback, useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { Platform, LogBox } from 'react-native';
import { useFonts } from 'expo-font';
import { MMKV } from 'react-native-mmkv'
import { createStackNavigator } from '@react-navigation/stack';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';

import {
  useGetMeQuery,
  setSession,
  setDeviceToken,
  selectSession,
  selectDeviceToken
} from '@ledget/shared-features';
import styles from './styles/app';
import { Box } from '@ledget/native-ui'
import { withProviders } from './Providers';
import { ENV, IOS_LEDGET_API_URI, ANDROID_LEDGET_API_URI } from '@env';
import { useAppearance } from '@features/appearanceSlice';
import { RootStackParamList } from '@types';
import { useModalStyleInterpolator, useAppDispatch, useAppSelector } from '@hooks';
import { selectEnvironment, setEnvironment } from '@ledget/shared-features';
import Authentication from './Authentication';
import BottomTabScreens from './BottomTabScreens';
import SourceSans3Regular from '../../assets/fonts/SourceSans3Regular.ttf';
import SourceSans3Medium from '../../assets/fonts/SourceSans3Medium.ttf';
import SourceSans3SemiBold from '../../assets/fonts/SourceSans3SemiBold.ttf';
import SourceSans3Bold from '../../assets/fonts/SourceSans3Bold.ttf';
import ModalScreens from './ModalScreens';
import Toast from './Toast';

export const storage = new MMKV();

LogBox.ignoreAllLogs();

const RootStack = createStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

const useAuthLogic = () => {
  const dispatch = useAppDispatch();
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [continueToMainApp, setContinueToMainApp] = useState(false);
  const session = useAppSelector(selectSession);
  const deviceToken = useAppSelector(selectDeviceToken);
  const {
    data: user,
    isError: isGetMeError
  } = useGetMeQuery(undefined, { skip: !session || !deviceToken });

  useEffect(() => {
    SecureStore.getItemAsync('session').then((session) => {
      if (!session) {
        setContinueToMainApp(false);
        setAppIsReady(true);
      } else {
        SecureStore.getItemAsync('device_token').then((token) => {
          if (!token) {
            setContinueToMainApp(false);
            setAppIsReady(true);
          } else {
            const sessionObj = JSON.parse(session);
            dispatch(setSession(sessionObj));
            dispatch(setDeviceToken(token));
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    // When the session is removed from the store, go back to the accounts screen
    if (!session) {
      setContinueToMainApp(false);
    }
  }, [session]);

  useEffect(() => {
    if (user && user.is_verified && session && deviceToken) {
      setContinueToMainApp(true);
      setAppIsReady(true);
    }
  }, [user, session, deviceToken]);

  useEffect(() => {
    if (isGetMeError) {
      setAppIsReady(true);
      setContinueToMainApp(false);
    }
  }, [isGetMeError]);

  return { continueToMainApp, appIsReady };
}

export const App = withProviders(() => {
  const dispatch = useAppDispatch();

  const [fontsGood, setFontsGood] = useState(false);
  const appearance = useAppearance();
  const environment = useAppSelector(selectEnvironment);

  const modalStyleInterpolator = useModalStyleInterpolator();

  const [fontsLoaded, fontError] = useFonts({
    'SourceSans3Regular': SourceSans3Regular,
    'SourceSans3Medium': SourceSans3Medium,
    'SourceSans3SemiBold': SourceSans3SemiBold,
    'SourceSans3Bold': SourceSans3Bold,
  });

  const { appIsReady, continueToMainApp } = useAuthLogic();

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    if (fontsLoaded && !fontError) { setFontsGood(true) }
  }, [fontsLoaded]);

  // Set the necessary environment variables
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (Platform.OS === 'android' && ENV === 'dev') {
      timeout = setTimeout(() => {
        dispatch(setEnvironment({
          name: ENV,
          apiUrl: Platform.OS === 'ios'
            ? IOS_LEDGET_API_URI
            : ANDROID_LEDGET_API_URI,
          platform: 'mobile'
        }));
      }, 1000);
    } else {
      dispatch(setEnvironment({
        name: ENV,
        apiUrl: Platform.OS === 'ios'
          ? IOS_LEDGET_API_URI
          : ANDROID_LEDGET_API_URI,
        platform: 'mobile'
      }));
    }
    return () => clearTimeout(timeout);
  }, [dispatch, ANDROID_LEDGET_API_URI]);

  // Set the navigation bar color and button style based on the theme
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NavigationBar.setPositionAsync("absolute");
    NavigationBar.setBackgroundColorAsync("#ffffff01");
    NavigationBar.setButtonStyleAsync(appearance.mode === 'dark' ? 'light' : 'dark');
  }, [appearance.mode, continueToMainApp]);

  if (!appIsReady || !environment || !fontsGood) {
    return null;
  }

  return (
    <Box
      backgroundColor={continueToMainApp ? 'mainBackground' : 'accountsMainBackground'}
      onLayout={onLayoutRootView}
      style={styles.root}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        style={appearance.mode === 'dark' ? 'light' : 'dark'}
      />
      <Toast />
      {continueToMainApp
        ?
        <RootStack.Navigator>
          <RootStack.Group screenOptions={{ headerShown: false }}>
            <RootStack.Screen name='BottomTabs' component={BottomTabScreens} />
          </RootStack.Group>
          <RootStack.Group
            screenOptions={{
              presentation: 'transparentModal',
              cardStyleInterpolator: modalStyleInterpolator,
              headerShown: false,
              cardOverlayEnabled: true,
            }}>
            <RootStack.Screen name='Modals' component={ModalScreens} />
          </RootStack.Group>
        </RootStack.Navigator>
        :
        <Authentication />}
    </Box>
  );
});

export default App;
