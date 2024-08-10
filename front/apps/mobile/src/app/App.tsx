import { useCallback, useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '@hooks';
import { selectEnvironment, setEnvironment } from '@ledget/shared-features';
import { useTheme } from '@shopify/restyle';
import { useFonts } from 'expo-font';
import { MMKV } from 'react-native-mmkv'
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';

import styles from './styles/app';
import { Box } from '@ledget/native-ui'
import { Budget, Accounts, Profile, Activity } from '@screens';
import { RootTabParamList } from '@types';
import { useAuthLogic } from './useAuthLogic';
import { withProviders } from './Providers';
import { ENV, IOS_LEDGET_API_URI, ANDROID_LEDGET_API_URI } from '@env';
import { useAppearance } from '@features/appearanceSlice';
import BottomNav from './BottomNav';
import Authentication from './Authentication';
import Modals from './Modals';
import SourceSans3Regular from '../../assets/fonts/SourceSans3Regular.ttf';
import SourceSans3Medium from '../../assets/fonts/SourceSans3Medium.ttf';
import SourceSans3SemiBold from '../../assets/fonts/SourceSans3SemiBold.ttf';
import SourceSans3Bold from '../../assets/fonts/SourceSans3Bold.ttf';

export const storage = new MMKV({
  id: `user-storage`,
  path: `ledget/storage`
})

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
  const [fontsGood, setFontsGood] = useState(false);
  const appearance = useAppearance();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const environment = useAppSelector(selectEnvironment);

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
    if (fontsLoaded && !fontError) {
      setFontsGood(true);
    }
  }, [fontsLoaded]);

  // Set the necessary environment variables
  useEffect(() => {
    dispatch(setEnvironment({
      name: ENV,
      apiUrl: Platform.OS === 'ios'
        ? IOS_LEDGET_API_URI
        : ANDROID_LEDGET_API_URI,
      platform: 'mobile'
    }));
  }, [dispatch]);

  // Set the navigation bar color and button style based on the theme
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NavigationBar.setBackgroundColorAsync(theme.colors.androidbottomNavBackground);
    NavigationBar.setButtonStyleAsync(appearance.mode === 'dark' ? 'light' : 'dark');
  }, [appearance.mode]);

  if (!appIsReady || !environment || !fontsGood) {
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
