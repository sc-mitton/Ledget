import React from 'react'
import { ScrollView } from 'react-native';

import { Box } from '@ledget/native-ui';
import { ProfileScreenProps } from '@types';
import Household from './Household';
import PaymentMethod from './PaymentMethod';
import Connections from './Connections';
import Plan from './Plan';

const Screen = (props: ProfileScreenProps) => {

  return (
    <ScrollView>
      <Box variant='screenContent'>
        <Plan />
        <PaymentMethod />
        <Household />
        <Connections {...props} />
      </Box>
    </ScrollView>
  )
}

export default Screen
