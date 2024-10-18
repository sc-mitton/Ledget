import { createStackNavigator } from '@react-navigation/stack';

import { BottomTabScreenProps, HomeStackParamList } from '@types';
import Main from './main/Main';
import { useCardStyleInterpolator } from '@/hooks';

const Stack = createStackNavigator<HomeStackParamList>();

const Screen = (props: BottomTabScreenProps<'Home'>) => {
  const cardStyleInterpolator = useCardStyleInterpolator()

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator,
        headerTransparent: true,
        headerTitle: () => '',
      }}
    >
      <Stack.Screen name='Main' component={Main} />
    </Stack.Navigator>
  )
}

export default Screen
