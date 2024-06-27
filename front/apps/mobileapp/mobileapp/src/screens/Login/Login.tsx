
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Email from './Email';
import Aal1Authentication from './Aal1Authentication';
import Aal2Authentication from './Aal2Authentication';
import { RootAccountStackParamList } from '@types';

const Stack = createNativeStackNavigator<RootAccountStackParamList>();

export default function () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} id='Accounts'>
      <Stack.Screen name="Email" component={Email} />
      <Stack.Screen name="Aal1Authentication" component={Aal1Authentication} />
      <Stack.Screen name="Aal2Authentication" component={Aal2Authentication} />
    </Stack.Navigator>
  )
}
