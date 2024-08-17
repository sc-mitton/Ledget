import React from 'react'
import { LogOut } from 'geist-native-icons';

import { Box, Button, Icon } from '@ledget/native-ui';
import { ProfileScreenProps } from '@types';
import { useAppDispatch } from '@/hooks';
import { setModal } from '@features/modalSlice';
import Household from './Household';
import Connections from './Connections';

const Screen = (props: ProfileScreenProps<'Main'>) => {
  const dispatch = useAppDispatch();

  return (
    <Box variant='screenContent'>
      <Household {...props} />
      <Connections {...props} />
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
  )
}

export default Screen
