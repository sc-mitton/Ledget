import { createStackNavigator } from "@react-navigation/stack";

import Email from './Email';
import Aal1 from './Aal1';
import Aal2Authenticator from './Aal2Authenticator';
import Aal2RecoveryCode from './Aal2RecoveryCode';
import { RootAccountStackParamList } from '@types';
import { BackHeader } from '@components';
import { useCardStyleInterpolator } from "@/hooks";

const Stack = createStackNavigator<RootAccountStackParamList>();

export default function () {
  const cardStyleInterpolator = useCardStyleInterpolator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <BackHeader {...props} />,
        cardStyleInterpolator,
      }}
      id='Accounts'
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
