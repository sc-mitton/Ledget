import { useState } from 'react';
import { View, ScrollView } from 'react-native';

import styles from './styles/screen';
import { Box, Button, Icon } from '@ledget/native-ui';
import { LogOut } from 'geist-native-icons';
import { setModal } from '@features/modalSlice';
import { useAppDispatch } from '@hooks';
import Devices from './Devices';
import Mfa from './Mfa';

const Screen = () => {
  const dispatch = useAppDispatch();
  return (
    <ScrollView>
      <Box variant='screenContent'>
        <Devices />
        <Mfa />
        <View style={styles.logoutButton}>
          <Button
            onPress={() => dispatch(setModal('logout'))}
            label={'Logout'}
            backgroundColor='nestedContainer'
            borderColor='nestedContainerBorder'
            variant='borderedGrayMain'>
            <Icon icon={LogOut} size={18} color='secondaryText' />
          </Button>
        </View>
      </Box>
    </ScrollView>
  )
}

export default Screen
