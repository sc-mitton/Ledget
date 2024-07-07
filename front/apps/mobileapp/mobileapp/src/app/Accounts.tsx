import { createStackNavigator } from '@react-navigation/stack';

import { Login, Recovery, Verification } from '@screens';
import { RootAccountStackParamList } from '@types';
import { BackHeader } from '@ledget/native-ui';
import { useCardStyleInterpolator } from "@/hooks";

const Stack = createStackNavigator<RootAccountStackParamList>();

const Authentication = () => {
  const cardStyleInterpolator = useCardStyleInterpolator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <BackHeader {...props} />,
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
