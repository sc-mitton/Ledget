import React from 'react'
import { ScrollView, View } from 'react-native';
import { LogOut } from 'geist-native-icons';

import styles from './styles/screen';
import { Box, Button, Icon } from '@ledget/native-ui';
import { AccountScreenProps } from '@types';
import { setModal } from '@features/modalSlice';
import { useAppDispatch } from '@hooks';
import Household from './Household';
import Connections from './Connections';

const Screen = (props: AccountScreenProps) => {
  const dispatch = useAppDispatch();

  return (
    <ScrollView>
      <Box variant='screenContent'>
        <Household />
        <Connections {...props} />
        <View style={styles.logoutButton}>
          <Button
            onPress={() => dispatch(setModal('logout'))}
            label={'Logout'}
            backgroundColor='nestedContainer'
            borderColor='nestedContainerBorder'
            textColor='mainText'
            variant='borderedGrayMain'>
            <Icon icon={LogOut} size={18} />
          </Button>
        </View>
      </Box>
    </ScrollView>
  )
}

export default Screen
