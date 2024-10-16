import { createStackNavigator } from '@react-navigation/stack';

import styles from './styles/screen';
import { Icon, Box, Header2, BackHeader, Button } from '@ledget/native-ui';
import { BottomTabScreenProps, HomeScreenProps, HomeStackParamList } from '@types';
import { useGetMeQuery } from '@ledget/shared-features';
import { Settings } from 'geist-native-icons';

const Stack = createStackNavigator<HomeStackParamList>();

const MainScreen = (props: HomeScreenProps<'Main'>) => {

  return (
    <Box variant='screen'>

    </Box>
  )
}

const Screen = (props: BottomTabScreenProps<'Home'>) => {
  const { data: user } = useGetMeQuery();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <BackHeader {...props} />,
      }}
    >
      <Stack.Screen
        options={{
          header: () =>
            <Box paddingTop='statusBar' paddingHorizontal='pagePadding' style={styles.header}>
              <Header2>
                {`Welcome ${user?.name.first}`}
              </Header2>
              <Button variant='square' backgroundColor='grayButton'>
                <Icon icon={Settings} color='secondaryText' />
              </Button>
            </Box>
        }}
        name='Main'
        component={MainScreen}
      />
    </Stack.Navigator>
  )
}

export default Screen
