import { createStackNavigator } from '@react-navigation/stack';

import { Box, Header } from '@ledget/native-ui';
import { BottomTabScreenProps, HomeScreenProps, HomeStackParamList } from '@types';

const Stack = createStackNavigator<HomeStackParamList>();

const MainScreen = (props: HomeScreenProps<'Main'>) => {

  return (
    <Box variant='screen'>

    </Box>
  )
}

const Screen = (props: BottomTabScreenProps<'Home'>) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Main' component={MainScreen} />
    </Stack.Navigator>
  )
}

export default Screen
