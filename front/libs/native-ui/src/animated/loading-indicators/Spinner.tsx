import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  ReduceMotion,
  useAnimatedStyle
} from 'react-native-reanimated';

import styles from './styles';
import { Box } from '../../restyled/Box';

const config = { duration: 1200, easing: Easing.bezier(0.5, 0, 0.5, 1), reduceMotion: ReduceMotion.System }
const ringBoxProps = {
  borderRightColor: 'mainText',
  borderBottomColor: 'transparent',
  borderLeftColor: 'transparent',
  borderTopColor: 'transparent',
} as const;

export const Spinner = () => {
  const pop = useSharedValue(.95);
  const r1 = useSharedValue(0);
  const r2 = useSharedValue(0);
  const r3 = useSharedValue(0);
  const r4 = useSharedValue(0);

  useEffect(() => {
    pop.value = withSequence(
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 }),
    )
    r1.value = withRepeat(withTiming(360, config), -1);
    r2.value = withDelay(150, withRepeat(withTiming(360, config), -1));
    r3.value = withDelay(300, withRepeat(withTiming(360, config), -1));
    r4.value = withDelay(450, withRepeat(withTiming(360, config), -1));
  }, [])

  const a1 = useAnimatedStyle(() => ({ transform: [{ rotate: `${r1.value}deg` }] }))
  const a2 = useAnimatedStyle(() => ({ transform: [{ rotate: `${r2.value}deg` }] }))
  const a3 = useAnimatedStyle(() => ({ transform: [{ rotate: `${r3.value}deg` }] }))
  const a4 = useAnimatedStyle(() => ({ transform: [{ rotate: `${r4.value}deg` }] }))

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pop }] }]}>
      <View style={styles.ringContainer}>
        <Animated.View style={[styles.animatedRingContainer, a1]}>
          <Box {...ringBoxProps} style={styles.ring} />
        </Animated.View>
      </View>
      <View style={styles.ringContainer}>
        <Animated.View style={[styles.animatedRingContainer, a2]}>
          <Box {...ringBoxProps} style={styles.ring} />
        </Animated.View>
      </View>
      <View style={styles.ringContainer}>
        <Animated.View style={[styles.animatedRingContainer, a3]}>
          <Box {...ringBoxProps} style={styles.ring} />
        </Animated.View>
      </View>
      <View style={styles.ringContainer}>
        <Animated.View style={[styles.animatedRingContainer, a4]}>
          <Box {...ringBoxProps} style={styles.ring} />
        </Animated.View>
      </View>
    </Animated.View>
  )
}
