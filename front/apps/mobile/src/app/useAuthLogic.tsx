import { useEffect, useState } from 'react';

import * as SecureStore from 'expo-secure-store';

import { useAppDispatch, useAppSelector } from '@hooks';
import {
  useGetMeQuery,
  setSession,
  setDeviceToken,
  selectSession,
  selectDeviceToken
} from '@ledget/shared-features';

export const useAuthLogic = () => {
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
