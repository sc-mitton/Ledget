import { Dimensions } from 'react-native';
import { LogOut } from 'geist-native-icons';

import { Box } from '@ledget/native-ui';
import Devices from './Devices';
import Mfa from './Mfa';
import { AccountScreenProps } from '@types';
import { Button, Icon } from '@ledget/native-ui';
import { setModal } from '@/features/modalSlice';
import { useAppDispatch } from '@/hooks';


const Screen = (props: AccountScreenProps) => {
  const dispatch = useAppDispatch();

  return (
    <Box variant='screenContent' style={{ height: Dimensions.get('window').height - 200 }}>
      <Mfa />
      <Devices {...props} />
      <Button
        onPress={() => dispatch(setModal('logout'))}
        label={'Logout'}
        backgroundColor='transparent'
        borderColor='transparent'
        textColor='blueText'
        variant='borderedGrayMain'>
        <Icon icon={LogOut} size={18} color='blueText' />
      </Button>
    </Box>
  );
}

export default Screen
