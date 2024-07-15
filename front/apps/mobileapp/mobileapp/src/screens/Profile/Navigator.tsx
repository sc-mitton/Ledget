import styles from './styles/navigator';
import { Header, Box } from '@ledget/native-ui';
import { TabsNavigator } from '@ledget/native-ui';
import Account from './Account/Screen';
import Security from './Security/Screen';
import Connections from './Connections/Screen';

const scenes = {
  account: Account,
  security: Security,
  connections: Connections,
};

export default function Portfolio() {

  return (
    <>
      <Box variant='header' style={styles.header}>
        <Header>Profile</Header>
      </Box>
      <TabsNavigator screens={scenes} />
    </>
  );
}
