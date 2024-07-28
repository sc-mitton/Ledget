import { useCallback, useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { ThemeProvider as RestyleThemeProvider, useTheme } from '@shopify/restyle';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as ReduxProvider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventProvider } from 'react-native-outside-press';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';

import styles from './styles/app';
import {
  darkTheme,
  lightTheme,
  AppearanceProvider,
  useAppearance,
  Box
} from '@ledget/native-ui'
import { Budget, Accounts, Profile, Activity } from '@screens';
import { useAppDispatch, useAppSelector, useAuthLogic } from '@hooks';
import { selectEnvironment, setEnvironment } from '@ledget/shared-features';
import { RootTabParamList } from '@types';
import { ENV, IOS_LEDGET_API_URI, ANDROID_LEDGET_API_URI } from '@env';
import store from '@features/store';
import BottomNav from './BottomNav';
import Authentication from './Accounts';
import Modals from './Modals';

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
  const appearance = useAppearance();
  const theme = useTheme();
  const { appIsReady, continueToMainApp } = useAuthLogic();

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NavigationBar.setBackgroundColorAsync(theme.colors.mainBackground);
  }, [appearance.mode]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <StatusBar style={appearance.mode === 'dark' ? 'light' : 'dark'} />
      <Modals />
      <Box
        backgroundColor={continueToMainApp ? 'mainBackground' : 'accountsMainBackground'}
        style={styles.main}
        onLayout={onLayoutRootView}
      >
        <NavigationContainer theme={navTheme}>
          {continueToMainApp
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
      apiUrl: Platform.OS === 'ios' ? IOS_LEDGET_API_URI : ANDROID_LEDGET_API_URI,
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
        <EventProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemedApp />
          </GestureHandlerRootView>
        </EventProvider>
      </ReduxProvider>
    </AppearanceProvider>
  )
}
