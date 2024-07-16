import { useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import {
  useGetMeQuery,
  useRefreshDevicesMutation,
  apiSlice
} from '@ledget/shared-features';
import { hasErrorCode } from '@ledget/helpers';

interface Props {
  navigation: StackNavigationProp<any>
  route: RouteProp<any, any>
  isComplete: boolean
}

export const useCheckFlowProgress = ({ navigation, route, isComplete }: Props) => {
  const { error, data: user } = useGetMeQuery();
  const [refreshDevices, { isUninitialized }] = useRefreshDevicesMutation()

  // Navigate to aal2 if needed or if user is not verified
  // then navigate to verification
  useEffect(() => {
    if (error && hasErrorCode('AAL2_TOTP_REQUIRED', error)) {
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
  }, [error, user, navigation, route.params?.identifier]);

  // Invalidate user query cache on successful flow, no matter the stage
  // to check for updated user data
  useEffect(() => {
    if (isComplete) {
      apiSlice.util.invalidateTags(['User']);
    }
  }, [isComplete]);

  // Refresh devices on user verification
  useEffect(() => {
    if (user && user.is_verified && isUninitialized) {
      refreshDevices();
    }
  }, [user]);
};
