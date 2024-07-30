import { useCallback, useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '@hooks';
import { selectEnvironment, setEnvironment } from '@ledget/shared-features';
import type { EnvironmentName } from '@ledget/shared-features';
import { useTheme } from '@shopify/restyle';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';

import styles from './styles/app';
import {
  useAppearance,
  Box
} from '@ledget/native-ui'
import { Budget, Accounts, Profile, Activity } from '@screens';
import { RootTabParamList } from '@types';
import { useAuthLogic } from './useAuthLogic';
import { withProviders } from './Providers';
import BottomNav from './BottomNav';
import Authentication from './Authentication';
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

export const App = withProviders(() => {
  const appearance = useAppearance();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const environment = useAppSelector(selectEnvironment);

  const { appIsReady, continueToMainApp } = useAuthLogic();

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Set the necessary environment variables
  useEffect(() => {
    dispatch(setEnvironment({
      name: process.env.ENV as EnvironmentName,
      apiUrl: Platform.OS === 'ios'
        ? process.env.IOS_LEDGET_API_URI || ''
        : process.env.ANDROID_LEDGET_API_URI || '',
      platform: 'mobile'
    }));
  }, [dispatch]);

  // Set the navigation bar color and button style based on the theme
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NavigationBar.setBackgroundColorAsync(theme.colors.androidNavBackground);
    NavigationBar.setButtonStyleAsync(appearance.mode === 'dark' ? 'light' : 'dark');

  }, [appearance.mode]);

  if (!appIsReady || !environment) {
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
});

export default App;
