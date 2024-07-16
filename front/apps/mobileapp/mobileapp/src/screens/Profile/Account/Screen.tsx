import { Box, Text } from '@ledget/native-ui';
import React from 'react'

import Household from './Household';
import PaymentMethod from './PaymentMethod';
import Preferences from './Preferences';
import Plan from './Plan';

const Screen = () => {

  return (
    <Box variant='screenContent'>
      <Household />
      <Plan />
      <PaymentMethod />
      <Preferences />
    </Box>
  )
}

export default Screen
