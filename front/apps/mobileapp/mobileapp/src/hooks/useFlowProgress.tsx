import { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import {
  useGetMeQuery,
  useRefreshDevicesMutation,
  apiSlice,
  selectSession,
  setDeviceToken
} from '@ledget/shared-features';
import { hasErrorCode } from '@ledget/helpers';
import { useAppSelector } from './store';

interface Props {
  navigation?: StackNavigationProp<any>
  route?: RouteProp<any, any>
  updateProgress?: boolean
}

export const useFlowProgress = ({ navigation, route, updateProgress }: Props) => {
  const [authFlowStarted, setAuthFlowStarted] = useState(false);
  const { error: getMeError, data: user } = useGetMeQuery(undefined, { skip: !authFlowStarted });
  const [refreshDevices] = useRefreshDevicesMutation({ fixedCacheKey: 'refreshDevices' })

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
    } else if (authFlowStarted) {
      refreshDevices();
    }
  }, [getMeError, user, updateProgress]);

  useEffect(() => {
    if (updateProgress) {
      setAuthFlowStarted(true);
      apiSlice.util.invalidateTags(['User']);
    }
  }, [updateProgress, session]);

};
