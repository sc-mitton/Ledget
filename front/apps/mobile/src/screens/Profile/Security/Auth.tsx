import { View } from 'react-native';
import dayjs from 'dayjs';
import { Lock } from 'geist-native-icons';

import styles from './styles/auth';
import { Box, Text, BoxHeader, Icon, ChevronTouchable, Seperator } from '@ledget/native-ui';
import { Qr } from '@ledget/media/native';
import { useGetMeQuery } from '@ledget/shared-features';
import { ProfileScreenProps } from '@types';

const MultiFactor = (props: ProfileScreenProps<'Main'>) => {
  const { data: user } = useGetMeQuery();

  return (
    <>
      <BoxHeader>Authentication</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer' style={styles.box}>
        {user?.settings.mfa_method === 'totp'
          ?
          <ChevronTouchable >
            <View style={styles.qrIcon}>
              <Icon icon={Qr} size={24} />
            </View>
            <View>
              <Text>Authenticator App</Text>
              <Text color='tertiaryText' fontSize={14}>
                {`Enabled on ${dayjs().format('MMM D, YYYY')}`}
              </Text>
            </View>
          </ChevronTouchable>
          :
          <ChevronTouchable onPress={() => props.navigation.navigate('Modals', { screen: 'AuthenticatorAppSetup' })}>
            <View style={styles.qrIcon}>
              <Icon icon={Qr} size={24} />
            </View>
            <Text>Authenticator App</Text>
          </ChevronTouchable>}
        <Seperator variant='m' />
        <ChevronTouchable onPress={() => props.navigation.navigate('Modals', { screen: 'ChangePassword' })}>
          <View style={styles.lockIcon}>
            <Icon icon={Lock} />
          </View>
          <Text>Change Password</Text>
        </ChevronTouchable>
      </Box>
    </>
  )
}

export default MultiFactor
