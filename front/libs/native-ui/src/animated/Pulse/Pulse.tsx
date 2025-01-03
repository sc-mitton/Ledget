import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

import styles from './styles';
import { Box } from '../../restyled/Box';

type Size = 's' | 'm' | 'l';

interface PulseProps {
  size?: Size;
  success: boolean;
}

interface CircleProps {
  size: Size;
  position: 'inner' | 'outer';
  green?: boolean;
}

const sizes = {
  s: 48,
  m: 54,
  l: 84,
};

const inactiveInnerPulseLength = 4000;
const inactiveInnerPulseDelay = 500;
const inactiveOuterPulseLength = 4000;

const Circle = ({ green = false, size = 'l', position }: CircleProps) => {
  return (
    <Box
      backgroundColor={green ? 'pulseGreen' : 'pulseWaiting'}
      borderRadius="circle"
      width={sizes[size]}
      height={sizes[size]}
      style={[
        styles.svg,
        {
          transform: [
            { translateY: -sizes[size] / 2 },
            { translateX: -sizes[size] / 2 },
          ],
        },
      ]}
    />
  );
};

export const Pulse = ({ size = 'm', success }: PulseProps) => {
  // Shared scale values
  const inactiveInnerPulse = useSharedValue(0.8);
  const inactiveOuterPulse = useSharedValue(1.3);
  const activeInnerPulse = useSharedValue(0);
  const activeOuterPulse = useSharedValue(0);
  const opacityOuter = useSharedValue(0.05);
  const opacityInner = useSharedValue(0.1);

  const successOpacity = useSharedValue(1);

  useEffect(() => {
    inactiveInnerPulse.value = withDelay(
      inactiveInnerPulseDelay,
      withRepeat(
        withTiming(1.5, {
          duration: inactiveInnerPulseLength + inactiveInnerPulseDelay,
        }),
        -1,
        true
      )
    );
    inactiveOuterPulse.value = withRepeat(
      withTiming(1.9, {
        duration: inactiveOuterPulseLength + inactiveInnerPulseDelay,
      }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (success) {
      opacityInner.value = withTiming(0, { duration: 250 });
      opacityOuter.value = withTiming(0, { duration: 250 });

      successOpacity.value = withTiming(0, { duration: 1500 });
      activeInnerPulse.value = withTiming(2.25, { duration: 1500 });
      activeOuterPulse.value = withTiming(3, { duration: 1500 });
    }
  }, [success]);

  return (
    <>
      <View key="inactive-pulse" style={styles.pulseContainer}>
        {/* Inactive Inner */}
        <Animated.View
          style={{
            transform: [{ scale: inactiveInnerPulse }],
            zIndex: -1,
            opacity: opacityInner,
          }}
        >
          <Circle size={size} position="inner" />
        </Animated.View>
        {/* Inactive Outer */}
        <Animated.View
          style={{
            transform: [{ scale: inactiveOuterPulse }],
            zIndex: -2,
            opacity: opacityOuter,
          }}
        >
          <Circle size={size} position="outer" />
        </Animated.View>
      </View>

      <View key="success-pulse" style={styles.pulseContainer}>
        {/* Active Inner */}
        <Animated.View
          style={{
            transform: [{ scale: activeInnerPulse }],
            zIndex: -1,
            opacity: successOpacity,
          }}
        >
          <Circle size={size} position="inner" green />
        </Animated.View>
        {/* Active Outer */}
        <Animated.View
          style={{
            transform: [{ scale: activeOuterPulse }],
            zIndex: -2,
            opacity: successOpacity,
          }}
        >
          <Circle size={size} position="inner" green />
        </Animated.View>
      </View>
    </>
  );
};
