import { useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Animated } from 'react-native';
import { useTheme } from "@shopify/restyle";

import Email from './Email';
import Aal1Authentication from './Aal1Authentication';
import Aal2Authentication from './Aal2Authentication';
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
        name="Aal1Authentication"
        component={Aal1Authentication}
      />
      <Stack.Screen
        options={{ headerShown: true }}
        name="Aal2Authentication"
        component={Aal2Authentication}
      />
    </Stack.Navigator>
  )
}
