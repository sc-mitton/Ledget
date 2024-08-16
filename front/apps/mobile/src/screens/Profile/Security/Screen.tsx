import { LogOut } from 'geist-native-icons';
import { View } from 'react-native';

import styles from './styles/screen';
import { Box } from '@ledget/native-ui';
import Devices from './Devices';
import Mfa from './Auth';
import { AccountScreenProps } from '@types';
import { Button, Icon } from '@ledget/native-ui';
import { setModal } from '@/features/modalSlice';
import { useAppDispatch } from '@/hooks';


const Screen = (props: AccountScreenProps) => {
  const dispatch = useAppDispatch();

  return (
    <Box variant='screenContent'>
      <Mfa />
      <Devices {...props} />
      <View style={styles.logoutButton}>
        <Button
          onPress={() => dispatch(setModal('logoutAllDevices'))}
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
