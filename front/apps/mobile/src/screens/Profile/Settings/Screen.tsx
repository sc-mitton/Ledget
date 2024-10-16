import { Box } from '@ledget/native-ui';
import { ProfileScreenProps } from '@types';
import Appearance from './Appearance';
import Options from './Options';
// import Notifications from './Notifications';

const Screen = (props: ProfileScreenProps<'Settings'>) => (
  <Box variant='nestedScreen'>
    <Appearance />
    <Options />
    {/* <Notifications /> */}
  </Box>
)

export default Screen



/*

Widgets grid idea breakdown

Have grid of widges

Widgets
- Currently widgges
- Unset widgets

Use similar idea to the credit card modal picker


After long holding one of the new widgets, all of the other unset widgets
should fade away and the dragged widget should be free to be moved around into place


*/
