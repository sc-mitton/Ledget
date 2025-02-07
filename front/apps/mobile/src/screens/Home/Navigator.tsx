import { createStackNavigator } from '@react-navigation/stack';
import { User } from 'geist-native-icons';

import { BottomTabScreenProps, HomeStackParamList } from '@types';
import Main from './newMain/Screen';
import { useCardStyleInterpolator } from '@/hooks';
import { useGetMeQuery } from '@ledget/shared-features';
import { Box, Text, Button, Icon } from '@ledget/native-ui';
import { capitalize } from '@ledget/helpers';
import { Category } from '@screens';
const Stack = createStackNavigator<HomeStackParamList>();

const Screen = (props: BottomTabScreenProps<'Home'>) => {
  const cardStyleInterpolator = useCardStyleInterpolator();
  const { data: user } = useGetMeQuery();

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator,
        headerTransparent: true,
        headerTitle: () => '',
        headerLeft: () => (
          <Box paddingLeft={'l'}>
            <Text fontSize={20} lineHeight={24} variant="bold">
              {capitalize(
                (user?.name.first || '') + ' ' + (user?.name.last || '')
              )}
            </Text>
          </Box>
        ),
        headerRight: () => (
          <Button
            marginRight={'m'}
            backgroundColor={'avatar'}
            borderRadius="circle"
            onPress={() => {
              props.navigation.navigate('Profile', { screen: 'Main' });
            }}
          >
            <Icon icon={User} size={18} strokeWidth={2} color="whiteText" />
          </Button>
        ),
      }}
    >
      <Stack.Screen
        name="Main"
        component={Main}
        initialParams={{ state: 'idle' }}
      />
      <Stack.Screen name="Category" component={Category} />
    </Stack.Navigator>
  );
};

export default Screen;
