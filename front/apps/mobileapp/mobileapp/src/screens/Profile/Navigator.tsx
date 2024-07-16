import { View } from 'react-native';
import { Edit2 } from 'geist-native-icons';

import styles from './styles/navigator';
import { Header, Box } from '@ledget/native-ui';
import { useGetMeQuery } from '@ledget/shared-features';
import { TabsNavigator, Avatar, Text, Icon } from '@ledget/native-ui';
import Account from './Account/Screen';
import Security from './Security/Screen';
import Connections from './Connections/Screen';

const scenes = {
  account: Account,
  security: Security,
  connections: Connections,
};

export default function Portfolio() {
  const { data: user } = useGetMeQuery();

  return (
    <>
      <Box variant='header' style={styles.header}>
        <Header>Profile</Header>
        <Box
          variant='nestedContainer'
          backgroundColor='nestedContainer'
          style={styles.userInfoContainer}
        >
          <Avatar size='l' name={user?.name} />
          <View style={styles.userInfo}>
            <Text>{user?.name.first} {user?.name.last}</Text>
            <Text color='secondaryText'>{user?.email}</Text>
          </View>
          <Icon icon={Edit2} size={16} />
        </Box>
      </Box>
      <TabsNavigator screens={scenes} />
    </>
  );
}
