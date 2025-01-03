import { useEffect, useId } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  useAnimatedStyle,
} from 'react-native-reanimated';

import styles from './styles/loading-dots';
import { Box } from '../../restyled/Box';

export const LoadingDots = ({ visible }: { visible: boolean }) => {
  const id = useId();

  const opacity0 = useSharedValue(0);
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      const config = { duration: 700 };
      opacity0.value = withDelay(
        0,
        withRepeat(
          withSequence(withTiming(1, config), withTiming(0, config)),
          -1
        )
      );
      opacity1.value = withDelay(
        150,
        withRepeat(
          withSequence(withTiming(1, config), withTiming(0, config)),
          -1
        )
      );
      opacity2.value = withDelay(
        350,
        withRepeat(
          withSequence(withTiming(1, config), withTiming(0, config)),
          -1
        )
      );
    } else {
      opacity0.value = withTiming(0);
      opacity1.value = withTiming(0);
      opacity2.value = withTiming(0);
    }
  }, [visible]);

  const style0 = useAnimatedStyle(() => ({ opacity: opacity0.value }));
  const style1 = useAnimatedStyle(() => ({ opacity: opacity1.value }));
  const style2 = useAnimatedStyle(() => ({ opacity: opacity2.value }));

  return (
    <Box style={styles.container}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Animated.View
          key={`${id}-dot-${i}`}
          style={[styles.dot, i === 0 ? style0 : i === 1 ? style1 : style2]}
        >
          <Box style={styles.dot} backgroundColor={'secondaryText'} />
        </Animated.View>
      ))}
    </Box>
  );
};
