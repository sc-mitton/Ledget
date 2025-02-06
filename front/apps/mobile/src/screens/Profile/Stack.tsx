import { createStackNavigator } from '@react-navigation/stack';

import {
  useGetCoOwnerQuery,
  useGetDevicesQuery,
  useGetPlaidItemsQuery,
} from '@ledget/shared-features';
import { ProfileStackParamList } from '@types';
import { BackHeader } from '@ledget/native-ui';
import { useCardStyleInterpolator } from '@/hooks';
import Security from './Security/Screen';
import Settings from './Settings/Screen';
import Connections from './Connections/Screen';
import CoOwner from './CoOwner/Screen';
import Main from './Main';

const Stack = createStackNavigator<ProfileStackParamList>();

export default function Navigator() {
  const cardStyleInterpolator = useCardStyleInterpolator();

  // Get coowner, connections, devices so that it's preloaded
  useGetDevicesQuery();
  useGetCoOwnerQuery();
  useGetPlaidItemsQuery();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => {
          return (
            <BackHeader
              {...props}
              pagesWithTitle={['Security', 'Settings', 'Connections']}
            />
          );
        },
        cardStyleInterpolator,
      }}
      initialRouteName="Main"
    >
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Security" component={Security} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="CoOwner" component={CoOwner} />
      <Stack.Screen name="Connections" component={Connections} />
    </Stack.Navigator>
  );
}
