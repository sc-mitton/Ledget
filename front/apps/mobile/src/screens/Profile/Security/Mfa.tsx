import { Box, Text, BoxHeader, Icon, ChevronTouchable } from '@ledget/native-ui';
import { Qr } from '@ledget/media/native';
import { setModal } from '@features/modalSlice';
import { useAppDispatch } from '@hooks';

const MultiFactor = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <BoxHeader>Authentication</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        <ChevronTouchable onPress={() => dispatch(setModal('authenticatorAppSetup'))}>
          <Icon icon={Qr} size={24} />
          <Text>Authenticator App</Text>
        </ChevronTouchable>
      </Box>
    </>
  )
}

export default MultiFactor
