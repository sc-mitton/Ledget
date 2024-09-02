import { Box } from '@ledget/native-ui';
import { ProfileScreenProps } from '@types';
import Appearance from './Appearance';
// import Notifications from './Notifications';

const Screen = (props: ProfileScreenProps<'Settings'>) => (
  <Box variant='nestedScreen'>
    <Appearance />
    {/* <Notifications /> */}
  </Box>
)

export default Screen
