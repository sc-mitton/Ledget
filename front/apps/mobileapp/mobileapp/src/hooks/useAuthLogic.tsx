import { useEffect, useState } from 'react';

import { useFonts } from 'expo-font';
import * as SecureStore from 'expo-secure-store';

import { useAppDispatch, useAppSelector } from '@hooks';
import {
  useRefreshDevicesMutation,
  useExtendTokenSessionMutation,
  useGetMeQuery,
  setSession,
  setDeviceToken,
  selectSession,
  apiSlice
} from '@ledget/shared-features';
import { hasErrorCode } from '@ledget/helpers';
import SourceSans3Regular from '../../assets/fonts/SourceSans3Regular.ttf';
import SourceSans3Medium from '../../assets/fonts/SourceSans3Medium.ttf';
import SourceSans3SemiBold from '../../assets/fonts/SourceSans3SemiBold.ttf';
import SourceSans3Bold from '../../assets/fonts/SourceSans3Bold.ttf';

export const useAuthLogic = () => {
  const dispatch = useAppDispatch();

  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [skipGetMe, setSkipGetMe] = useState(true);
  const [continueToMainApp, setContinueToMainApp] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'SourceSans3Regular': SourceSans3Regular,
    'SourceSans3Medium': SourceSans3Medium,
    'SourceSans3SemiBold': SourceSans3SemiBold,
    'SourceSans3Bold': SourceSans3Bold,
  });

  const {
    isSuccess: isGetMeSuccess,
    isError: isGetMeError,
    error: getMeError
  } = useGetMeQuery(undefined, { skip: skipGetMe });
  const [
    refreshDevices, {
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

  // Unskip getMe query if session is available
  // When session becomes unavailable, go to the authentication portion of the app
  useEffect(() => {
    if (session) {
      setSkipGetMe(false);
    } else {
      setContinueToMainApp(false);
    }
  }, [session]);

  // Try to refresh devices when
  // 1. the session is available and the devices haven't been refreshed yet
  // 2. the session is available, just extended successfully, and the devices haven't been refreshed yet
  useEffect(() => {
    if (session && isExtendSuccess) {
      refreshDevices();
    }
  }, [session, isExtendSuccess])

  // Try and extend the session if fetching the user data was unsuccessful due to an expired token
  useEffect(() => {
    if (session && hasErrorCode(401, getMeError) && isUninitializedExtend) {
      extendSession({ session_id: session.id });
    }
  }, [session, getMeError]);

  // Fetch user data after refreshing devices
  useEffect(() => {
    if (isRefreshDevicesSuccess) {
      apiSlice.util.invalidateTags(['User']);
    }
  }, [isRefreshDevicesSuccess]);

  // Checks for when the app is ready to load
  useEffect(() => {
    // Situation 1
    const situation1Checks = [
      fontsLoaded,
      !fontError,
      ((isExtendSuccess && isRefreshDevicesSuccess) || isGetMeSuccess)
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
    if (!SecureStore.getItem('session') && fontsLoaded && !fontError) {
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

  // When to continue to the main app
  useEffect(() => {
    if (isGetMeSuccess && isUninitializedExtend) {
      setContinueToMainApp(true);
    } else if (isGetMeSuccess && isRefreshDevicesSuccess && !extendError) {
      setContinueToMainApp(true);
    }
  }, [isGetMeSuccess, isRefreshDevicesSuccess, extendError, session]);


  // Store device token on successful device refresh
  useEffect(() => {
    if (deviceResult) {
      dispatch(setDeviceToken(deviceResult.device_token));
      SecureStore.setItemAsync('device_token', deviceResult.device_token);
    }
  }, [deviceResult]);

  return { continueToMainApp, appIsReady };
}
