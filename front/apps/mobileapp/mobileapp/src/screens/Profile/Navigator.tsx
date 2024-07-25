import { View } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";

import styles from './styles/navigator';
import { Header, Box } from '@ledget/native-ui';
import { useGetMeQuery } from '@ledget/shared-features';
import { TabsNavigator, Avatar, Text, ChevronTouchable } from '@ledget/native-ui';
import { ProfileStackParamList } from '@types';
import { BackHeader } from '@ledget/native-ui';
import { useCardStyleInterpolator } from "@/hooks";
import { ProfileScreenProps } from '@types';
import Account from './Account/Screen';
import Security from './Security/Screen';
import Settings from './Settings/Screen';
import Connection from './Connection/Screen';
import Device from './Device/Screen';

const scenes = {
  account: Account,
  settings: Settings,
  security: Security
};

const Stack = createStackNavigator<ProfileStackParamList>();

function Profile(props: ProfileScreenProps) {
  const { data: user } = useGetMeQuery();

  return (
    <>
      <Box
        backgroundColor='mainBackground'
        variant='header'
        style={styles.header} >
        <Header>Profile</Header>
        <Box
          paddingHorizontal='s'
          paddingVertical='l'
          style={styles.userInfoContainer}>
          <ChevronTouchable>
            <Avatar size='l' name={user?.name} />
            <View style={styles.userInfo}>
              <Text color='highContrastText'>{user?.name.first} {user?.name.last}</Text>
              <Text color='tertiaryText'>{user?.email}</Text>
            </View>
          </ChevronTouchable>
        </Box>
      </Box>
      <TabsNavigator screens={scenes} screenProps={props} />
    </>
  );
}

export default function Navigator() {
  const cardStyleInterpolator = useCardStyleInterpolator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <BackHeader {...props} />,
        cardStyleInterpolator,
      }}
      id='profile'
    >
      <Stack.Screen options={{ headerShown: false }} name='Profile' component={Profile} />
      <Stack.Screen name='Connection' component={Connection} />
      <Stack.Screen name='Device' component={Device} />
    </Stack.Navigator>
  );
}
