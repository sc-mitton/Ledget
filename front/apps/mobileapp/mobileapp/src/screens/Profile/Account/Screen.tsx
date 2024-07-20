import React from 'react'
import { ScrollView, View } from 'react-native';

import styles from './styles/screen';
import { Box, Button, Icon } from '@ledget/native-ui';
import { LogOut } from 'geist-native-icons';
import Household from './Household';
import PaymentMethod from './PaymentMethod';
import Connections from './Connections';
import Plan from './Plan';

const Screen = () => {

  return (
    <ScrollView style={styles.content}>
      <Box variant='screenContent'>
        <Plan />
        <PaymentMethod />
        <Household />
        <Connections />
        <View style={styles.logoutButton}>
          <Button label={'Logout'} variant='grayMain2'>
            <Icon icon={LogOut} />
          </Button>
        </View>
      </Box>
    </ScrollView>
  )
}

export default Screen
