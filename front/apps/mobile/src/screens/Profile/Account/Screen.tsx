import React from 'react'
import { ScrollView } from 'react-native';

import { Box } from '@ledget/native-ui';
import { AccountScreenProps } from '@types';
import Household from './Household';
import Connections from './Connections';

const Screen = (props: AccountScreenProps) => {
  return (
    <Box variant='screenContent'>
      <Household {...props} />
      <Connections {...props} />
    </Box>
  )
}

export default Screen
