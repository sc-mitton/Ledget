import { View } from 'react-native';

import styles from './styles/screen';
import { Box, Button, Icon } from '@ledget/native-ui';
import { LogOut } from 'geist-native-icons';
import Devices from './Devices';
import Mfa from './Mfa';

const Screen = () => {
  return (
    <Box variant='screenContent'>
      <Devices />
      <Mfa />
      <View style={styles.logoutButton}>
        <Button label={'Logout'} variant='grayMain2'>
          <Icon icon={LogOut} />
        </Button>
      </View>
    </Box>
  )
}

export default Screen
