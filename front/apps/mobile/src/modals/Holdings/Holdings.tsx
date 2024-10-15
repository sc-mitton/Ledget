import React from 'react';
import { View } from 'react-native';

import styles from './styles/holdings';
import { ModalScreenProps } from '@types';
import { Box, Header2 } from '@ledget/native-ui';

const AccountPicker = (props: ModalScreenProps<'Holdings'>) => {

  return (
    <Box
      backgroundColor='modalBox100'
      borderColor='modalBorder'
      borderWidth={1}
      style={styles.modalBackground}>
      <Box variant='dragBarContainer'>
        <Box variant='dragBar' />
      </Box>
      <View style={styles.header}>
      </View>
    </Box>
  )
}

export default AccountPicker
