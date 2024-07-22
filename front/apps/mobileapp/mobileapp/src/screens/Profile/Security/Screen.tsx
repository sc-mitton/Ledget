import { View, ScrollView } from 'react-native';

import styles from './styles/screen';
import { Box, Button, Icon } from '@ledget/native-ui';
import { LogOut } from 'geist-native-icons';
import Devices from './Devices';
import Mfa from './Mfa';

const Screen = () => {
  return (
    <ScrollView>
      <Box variant='screenContent'>
        <Devices />
        <Mfa />
        <View style={styles.logoutButton}>
          <Button label={'Logout'} variant='blueMain2'>
            <Icon icon={LogOut} color="blueText" />
          </Button>
        </View>
      </Box>
    </ScrollView>
  )
}

export default Screen
