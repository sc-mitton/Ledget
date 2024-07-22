import { Box, Text, BoxHeader, Icon, ChevronTouchable } from '@ledget/native-ui';
import { Qr } from '@ledget/media/native';

const MultiFactor = () => {

  return (
    <>
      <BoxHeader>Authentication</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        <ChevronTouchable>
          <Icon icon={Qr} size={24} />
          <Text>Authenticator App</Text>
        </ChevronTouchable>
      </Box>
    </>
  )
}

export default MultiFactor
