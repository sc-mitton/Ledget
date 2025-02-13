import { createStackNavigator } from '@react-navigation/stack';
import { User } from 'geist-native-icons';

import { BottomTabScreenProps, HomeStackParamList } from '@types';
import Main from './newMain/Screen';
import { useCardStyleInterpolator } from '@/hooks';
import { useGetMeQuery } from '@ledget/shared-features';
import { Box, Text, Button, Icon, BackHeader } from '@ledget/native-ui';
import { capitalize } from '@ledget/helpers';
import { Category, Profile } from '@screens';

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
        header: () => (
          <Box
            flex={1}
            flexDirection="row"
            paddingTop="statusBar"
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal="pagePadding"
            backgroundColor="mainBackground"
          >
            <Box paddingLeft={'m'}>
              <Text fontSize={20} lineHeight={24} variant="bold">
                {capitalize(
                  (user?.name.first || '') + ' ' + (user?.name.last || '')
                )}
              </Text>
            </Box>
            <Button
              marginBottom={'s'}
              borderColor="grayButtonBorder"
              borderWidth={1.5}
              borderRadius="circle"
              onPress={() => {
                props.navigation.navigate('Home', {
                  screen: 'Profile',
                  params: { screen: 'Main' } as any,
                });
              }}
            >
              <Icon icon={User} size={18} strokeWidth={2} />
            </Button>
          </Box>
        ),
      }}
    >
      <Stack.Screen
        name="Main"
        component={Main}
        initialParams={{ state: 'idle' }}
      />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen
        options={{
          header: BackHeader,
        }}
        name="Profile"
        component={Profile}
      />
    </Stack.Navigator>
  );
};

export default Screen;
