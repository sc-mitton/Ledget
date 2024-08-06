import { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import {
  useGetMeQuery,
  useRefreshDevicesMutation,
  apiSlice,
  selectSession,
  setDeviceToken,
  setSession
} from '@ledget/shared-features';
import { hasErrorCode } from '@ledget/helpers';
import { useAppSelector, useAppDispatch } from './store';

interface Props {
  navigation?: StackNavigationProp<any>
  route?: RouteProp<any, any>
  updateProgress?: boolean,
  token?: string,
  id?: string,
}

export const useFlowProgress = ({ navigation, route, updateProgress, token, id }: Props) => {
  const dispatch = useAppDispatch();
  const [authFlowStarted, setAuthFlowStarted] = useState(false);
  const { error: getMeError, data: user } = useGetMeQuery(undefined, { skip: !authFlowStarted });
  const [
    refreshDevices,
    {
      isSuccess: isRefreshSuccess,
      data: device
    }
  ] = useRefreshDevicesMutation({ fixedCacheKey: 'refreshDevices' })

  const session = useAppSelector(selectSession);

  // Handle necessary navigation to other flow steps, otherwise refresh devices
  useEffect(() => {
    if (!navigation || !route) return;

    if (getMeError && hasErrorCode('AAL2_TOTP_REQUIRED', getMeError)) {
      navigation.navigate('Login', {
        screen: 'Aal2Authenticator',
        identifier: route.params?.identifier
      })
    } else if (user && !user.is_verified) {
      navigation.navigate('Login', {
        screen: 'Verification',
        params: {
          identifier: route.params?.identifier
        }
      })
    }
  }, [getMeError, user, updateProgress]);

  useEffect(() => {
    if (user && user.is_verified) {
      refreshDevices();
    }
  }, [user]);

  useEffect(() => {
    if (isRefreshSuccess) {
      SecureStore.setItemAsync('device_token', device.device_token);
      dispatch(setDeviceToken(device.device_token));
    }
  }, [isRefreshSuccess]);

  useEffect(() => {
    if (token && id) {
      SecureStore.setItemAsync('session', JSON.stringify({ token, id }))
      dispatch(setSession({ token, id }))
    }
  }, [token])

  useEffect(() => {
    if (updateProgress) {
      setAuthFlowStarted(true);
      apiSlice.util.invalidateTags(['User']);
    }
  }, [updateProgress, session]);

};
