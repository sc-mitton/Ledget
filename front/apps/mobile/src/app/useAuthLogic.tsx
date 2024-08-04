import { useEffect, useState } from 'react';

import * as SecureStore from 'expo-secure-store';

import { useAppDispatch, useAppSelector } from '@hooks';
import {
  useRefreshDevicesMutation,
  useExtendTokenSessionMutation,
  useGetMeQuery,
  setSession,
  setDeviceToken,
  selectSession
} from '@ledget/shared-features';
import { hasErrorCode } from '@ledget/helpers';

/*

There are a lot of effect hooks here so here is the breakdown of how it works

There are a few main situations to handle

1. The user has a valid session stored and loads the app.
  - The user data will be fetched and on success, the app will be mounted and the
    the user will pass the account screens to the main app
2. The session is expired or otherwise invalid
  - The session will be extended
  - The user data will be fetched
  - The device will be refreshed
  - The app will be mounted and passed to the main app
3. The user has no session stored
  - The user will be taken to the accounts screen
4. There is a session stored but for some reason it's not able to be refreshed
  - First try to extend the session
  - Upon failing, continue to the app and pass to the first accounts screen
5. The session is removed from the store ie the user logs out
  - The user will be taken to the accounts screen

*/


export const useAuthLogic = () => {
  const dispatch = useAppDispatch();

  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [continueToMainApp, setContinueToMainApp] = useState(false);


  const session = useAppSelector(selectSession);
  const {
    isSuccess: isGetMeSuccess,
    isError: isGetMeError,
    error: getMeError,
    refetch: refetchGetMe
  } = useGetMeQuery(undefined, { skip: !session });
  const [
    refreshDevices, {
      isSuccess: isRefreshDevicesSuccess,
      isError: isRefreshDevicesError,
      data: deviceResult,
      isUninitialized: isRefreshDevicesUninitialized
    }] = useRefreshDevicesMutation({ fixedCacheKey: 'refreshDevices' })
  const [extendSession, {
    isUninitialized: isUninitializedExtend,
    isSuccess: isExtendSuccess,
    isUninitialized: isExtendUninitialized,
    isError: isExtendError,
  }] = useExtendTokenSessionMutation({ fixedCacheKey: 'extendSession' });

  // 1. Try and extend the session if fetching the user data was unsuccessful due to an expired token
  useEffect(() => {
    if (session && hasErrorCode(401, getMeError) && isUninitializedExtend) {
      extendSession({ session_id: session.id });
    }
  }, [session, getMeError]);

  // 2. Fetch user data after extending the session
  useEffect(() => {
    if (isExtendSuccess) {
      refetchGetMe();
    }
  }, [isExtendSuccess]);

  // 3. Refresh devices after fetching user data
  useEffect(() => {
    if (isGetMeSuccess && isExtendSuccess && isRefreshDevicesUninitialized) {
      refreshDevices();
    }
  }, [isGetMeSuccess, isRefreshDevicesUninitialized]);

  //

  //

  // When to continue to the main app
  // - There is no session stored (we'll need to show the login screen)
  // - When the device refresh is successful (happens after extending the session, at the very end)
  // - When able to fetch the user data without extending the session

  // If there is no session stored, we can continue to the main app if the fonts are loaded
  useEffect(() => {

    SecureStore.getItemAsync('session').then((session) => {
      if (!session) {
        setContinueToMainApp(false);
        setAppIsReady(true);
      }
    });

    // When the session is removed from the store, go back to the accounts screen
    if (!session) {
      setContinueToMainApp(false);
    }

    const checks = [
      [isRefreshDevicesSuccess],
      [isGetMeSuccess, isExtendUninitialized],
    ]
    if (checks.some((check) => check.every(b => Boolean(b)))) {
      setContinueToMainApp(true);
    }

  }, [
    session,
    isRefreshDevicesSuccess,
    isGetMeSuccess,
    isExtendUninitialized,
  ]);

  // Checks for when the app (either main or accounts) is ready
  useEffect(() => {
    const checks = [
      [isRefreshDevicesSuccess],
      [isGetMeSuccess && isExtendUninitialized],
      [(isRefreshDevicesError || isExtendError)]
    ];
    if (checks.some((check) => check.every(b => Boolean(b)))) {
      setAppIsReady(true);
    }

  }, [
    isGetMeError,
    isRefreshDevicesError,
    isGetMeSuccess,
    isRefreshDevicesSuccess
  ]);

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

  // Store device token on successful device refresh
  useEffect(() => {
    if (deviceResult) {
      dispatch(setDeviceToken(deviceResult.device_token));
      SecureStore.setItemAsync('device_token', deviceResult.device_token);
    }
  }, [deviceResult]);

  return { continueToMainApp, appIsReady };
}
