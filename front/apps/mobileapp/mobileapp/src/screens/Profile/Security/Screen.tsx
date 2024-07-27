import { ScrollView } from 'react-native';

import { Box } from '@ledget/native-ui';
import Devices from './Devices';
import Mfa from './Mfa';

const Screen = (props: any) => {
  return (
    <ScrollView>
      <Box variant='screenContent'>
        <Devices />
        <Mfa />
      </Box>
    </ScrollView>
  )
}

export default Screen
