import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Check } from 'geist-native-icons';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

import styles from './styles';
import type { CheckboxProps } from './types';
import { Box } from '../../restyled/Box';
import { Text } from '../../restyled/Text';
import { Icon } from '../../restyled/Icon';

export function Checkbox(props: CheckboxProps) {
  const [checked, setChecked] = useState(props.default === 'checked' ? true : false);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => { setChecked(!checked); props.onChange(!checked); }}
    >
      <Box
        backgroundColor={checked ? 'blueButton' : 'inputBackground'}
        borderColor={checked ? 'transparent' : 'inputBorder'}
        borderWidth={1.5}
        borderRadius='s'
        style={styles.checkbox}
      >
        <View style={styles.checkIconContainer} pointerEvents='none'>
          {checked &&
            <Animated.View
              style={styles.checkIcon}
              entering={ZoomIn.springify().damping(5).stiffness(200).mass(.2).overshootClamping(0)}
              exiting={ZoomOut.springify().damping(5).stiffness(200).mass(.2).overshootClamping(0)}
            >
              <Icon icon={Check} color='whiteText' strokeWidth={2.5} size={18} />
            </Animated.View>}
        </View>
      </Box>
      <Text>{props.label}</Text>
    </TouchableOpacity>
  );
}


export default Checkbox;
