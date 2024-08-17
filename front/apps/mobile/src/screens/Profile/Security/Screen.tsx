import { LogOut } from 'geist-native-icons';
import { View } from 'react-native';

import styles from './styles/screen';
import { Box } from '@ledget/native-ui';
import Devices from './Devices';
import Mfa from './Auth';
import { ProfileScreenProps } from '@types';
import { Button, Icon } from '@ledget/native-ui';

const Screen = (props: ProfileScreenProps<'Main'>) => {

  return (
    <Box variant='screenContent'>
      <Mfa {...props} />
      <Devices {...props} />
      <View style={styles.logoutButton}>
        <Button
          onPress={() => props.navigation.navigate('Modals', { screen: "LogoutAllDevices" })}
          label={'Logout All Devices'}
          backgroundColor='transparent'
          borderColor='transparent'
          textColor='blueText'
          variant='borderedGrayMain'>
          <Icon icon={LogOut} size={18} color='blueText' />
        </Button>
      </View>
    </Box>
  );
}

export default Screen
