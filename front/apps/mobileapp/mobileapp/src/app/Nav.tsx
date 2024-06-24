import { StyleSheet } from 'react-native';
import { Home, DollarSign, Activity, User } from 'geist-icons-native';

import { Box, Icon } from '@components';
import { Institution } from '@ledget/media/native';
import { styles } from './Styles';

export default function Nav() {

  return (
    <Box
      style={styles.nav}
      backgroundColor='navBackground'
      shadowColor='navShadow'
      shadowOffset={{ width: 0, height: -5 }}
      shadowRadius={20}
      shadowOpacity={.95}
    >
      <Icon icon={Home} />
      <Icon icon={DollarSign} />
      <Icon icon={Activity} />
      <Icon icon={Institution} />
      <Icon icon={User} />
    </Box>
  );
}

