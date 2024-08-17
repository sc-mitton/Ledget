import React from 'react'
import { LogOut } from 'geist-native-icons';

import { Box, Button, Icon } from '@ledget/native-ui';
import { ProfileScreenProps } from '@types';
import Household from './Household';
import Connections from './Connections';

const Screen = (props: ProfileScreenProps<'Main'>) => {

  return (
    <Box variant='screenContent'>
      <Household {...props} />
      <Connections {...props} />
      <Button
        onPress={() => props.navigation.navigate('Modals', { screen: 'Logout' })}
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
