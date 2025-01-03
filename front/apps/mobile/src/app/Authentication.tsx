import { createStackNavigator } from '@react-navigation/stack';

import { Login, Recovery, Verification } from '@screens';
import { RootAuthenticationStackParamList } from '@types';
import { BackHeader } from '@ledget/native-ui';
import { useCardStyleInterpolator } from '@/hooks';

const Stack = createStackNavigator<RootAuthenticationStackParamList>();

const Authentication = () => {
  const cardStyleInterpolator = useCardStyleInterpolator('authentication');

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => (
          <BackHeader {...props} authenticationScreens={true} />
        ),
        cardStyleInterpolator,
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Recovery"
        component={Recovery}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Verification"
        component={Verification}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default Authentication;
