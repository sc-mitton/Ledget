import { createStackNavigator } from "@react-navigation/stack";

import Email from './Email';
import Aal1 from './Aal1';
import Aal2Authenticator from './Aal2Authenticator';
import Aal2RecoveryCode from './Aal2RecoveryCode';
import { LoginStackParamList } from '@types';
import { BackHeader } from '@ledget/native-ui';
import { useCardStyleInterpolator } from "@/hooks";

const Stack = createStackNavigator<LoginStackParamList>();

export default function () {
  const cardStyleInterpolator = useCardStyleInterpolator('authentication');

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <BackHeader {...props} authenticationScreens={true} />,
        cardStyleInterpolator,
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="Email"
        component={Email}
      />
      <Stack.Screen
        options={{ headerShown: true }}
        name="Aal1"
        component={Aal1}
      />
      <Stack.Screen
        options={{ headerShown: true }}
        name="Aal2Authenticator"
        component={Aal2Authenticator}
      />
      <Stack.Screen
        options={{ headerShown: true }}
        name="Aal2RecoveryCode"
        component={Aal2RecoveryCode}
      />
    </Stack.Navigator>
  )
}
