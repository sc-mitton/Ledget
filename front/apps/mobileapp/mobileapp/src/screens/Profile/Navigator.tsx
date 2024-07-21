import { View } from 'react-native';

import styles from './styles/navigator';
import { Header, Box } from '@ledget/native-ui';
import { useGetMeQuery } from '@ledget/shared-features';
import { TabsNavigator, Avatar, Text } from '@ledget/native-ui';
import { ChevronRightButton } from './Account/shared';
import Account from './Account/Screen';
import Security from './Security/Screen';
import Settings from './Settings/Settings';

const scenes = {
  account: Account,
  settings: Settings,
  security: Security
};

export default function Portfolio() {
  const { data: user } = useGetMeQuery();

  return (
    <>
      <Box
        backgroundColor='mainBackground'
        variant='header'
        style={styles.header} >
        <Header>Profile</Header>
        <Box
          variant='nestedContainer'
          backgroundColor='mainBackground'
          paddingHorizontal='s'
          style={styles.userInfoContainer}
        >
          <Avatar size='l' name={user?.name} />
          <View style={styles.userInfo}>
            <Text color='highContrastText'>{user?.name.first} {user?.name.last}</Text>
            <Text color='secondaryText'>{user?.email}</Text>
          </View>
          <ChevronRightButton onPress={() => console.log('press')} />
        </Box>
      </Box>
      <TabsNavigator screens={scenes} />
    </>
  );
}
