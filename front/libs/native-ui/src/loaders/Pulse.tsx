import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';

import styles from './styles/pulse';
import { Box, BoxProps } from '../restyled/Box';

export const Pulse = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      Math.random() * 1500,
      withRepeat(withTiming(0.5, { duration: 1000 }), -1, true)
    );
  }, []);

  return (
    <Animated.View style={[{ opacity }, styles.pulse]}>
      <Box backgroundColor="nestedContainer" height={'100%'} width={'100%'} />
    </Animated.View>
  );
};

export default Pulse;
