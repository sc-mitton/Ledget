import { View } from 'react-native';
import dayjs from 'dayjs';

import styles from './styles/mfa';
import { Box, Text, BoxHeader, Icon, ChevronTouchable } from '@ledget/native-ui';
import { Qr } from '@ledget/media/native';
import { setModal } from '@features/modalSlice';
import { useGetMeQuery } from '@ledget/shared-features';
import { useAppDispatch } from '@hooks';

const MultiFactor = () => {
  const dispatch = useAppDispatch();
  const { data: user } = useGetMeQuery();

  return (
    <>
      <BoxHeader>Authentication</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
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
          <ChevronTouchable onPress={() => dispatch(setModal('authenticatorAppSetup'))}>
            <Icon icon={Qr} size={24} />
            <Text>Authenticator App</Text>
          </ChevronTouchable>}
      </Box>
    </>
  )
}

export default MultiFactor
