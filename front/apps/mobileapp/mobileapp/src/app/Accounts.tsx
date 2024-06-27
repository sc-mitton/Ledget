import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Login, Recovery, Verification } from '@screens';

const Stack = createNativeStackNavigator();

const Authentication = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Recovery" component={Recovery} />
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
};

export default Authentication;
