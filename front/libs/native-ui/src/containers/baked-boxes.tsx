import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Box } from '../restyled/Box';

export const NestedScreenWOFeedback = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Box variant="nestedScreen" paddingBottom="navHeight">
      {children}
    </Box>
  </TouchableWithoutFeedback>
);
