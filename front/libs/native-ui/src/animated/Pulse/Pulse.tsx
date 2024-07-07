import { View } from 'react-native';
import Svg, { Defs, Stop, RadialGradient as SVGRadialGradient, Circle as SvgCircle } from "react-native-svg"
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay
} from 'react-native-reanimated';

import styles from './styles';
import { useTheme } from '@shopify/restyle';
import { useEffect } from 'react';

type Size = 's' | 'm' | 'l'

interface PulseProps {
  size?: Size,
  success: boolean
}

interface CircleProps {
  size: Size
  position: 'inner' | 'outer'
  green?: boolean
}

const sizes = {
  s: 48,
  m: 54,
  l: 84,
};

const inactiveInnerPulseLength = 2000;
const inactiveInnerPulseDelay = 500;
const inactiveOuterPulseLength = 2000;

const Circle = ({ green = false, size = 'l', position }: CircleProps) => {
  const theme = useTheme();

  return (
    <Svg
      viewBox={`0 0 ${sizes[size]} ${sizes[size]}`}
      transform={[{ translateY: -sizes[size] / 2 }, { translateX: -sizes[size] / 2 }]}
      width={sizes[size]}
      height={sizes[size]}
      style={styles.svg}
    >
      <SvgCircle
        cx={'50%'}
        cy={'50%'}
        r={sizes[size] / 2}
        fill="url(#grad)"
      />
      <Defs>
        <SVGRadialGradient
          id="grad"
          cx="50%"
          cy="50%"
          r={sizes[size] / 2}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={theme.colors.mainBackground} />
          <Stop stopColor={theme.colors.mainBackground} offset={
            green
              ? position === 'inner' ? .3 : .4
              : position === 'inner' ? .85 : .9} />
          <Stop stopColor={green ? theme.colors.pulseGreen : theme.colors.pulseWaiting} offset={1} />
        </SVGRadialGradient>
      </Defs>
    </Svg>
  )
}

export const Pulse = ({ size = 'm', success }: PulseProps) => {

  // Shared scale values
  const inactiveInnerPulse = useSharedValue(.8);
  const inactiveOuterPulse = useSharedValue(1.3);
  const activeInnerPulse = useSharedValue(0);
  const activeOuterPulse = useSharedValue(0);
  const opacityOuter = useSharedValue(.3);
  const opacityInner = useSharedValue(.45);

  const successOpacity = useSharedValue(1);

  useEffect(() => {
    inactiveInnerPulse.value = withDelay(inactiveInnerPulseDelay, withRepeat(withTiming(1.5, { duration: inactiveInnerPulseLength + inactiveInnerPulseDelay }), -1, true));
    inactiveOuterPulse.value = withRepeat(withTiming(1.9, { duration: inactiveOuterPulseLength + inactiveInnerPulseDelay }), -1, true);
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
      <View key='inactive-pulse' style={styles.pulseContainer}>
        {/* Inactive Inner */}
        <Animated.View style={{ transform: [{ scale: inactiveInnerPulse }], zIndex: -1, opacity: opacityInner }}>
          <Circle size={size} position='inner' />
        </Animated.View>
        {/* Inactive Outer */}
        <Animated.View style={{ transform: [{ scale: inactiveOuterPulse }], zIndex: -2, opacity: opacityOuter }}>
          <Circle size={size} position='outer' />
        </Animated.View>
      </View>

      <View key='success-pulse' style={styles.pulseContainer}>
        {/* Active Inner */}
        <Animated.View style={{ transform: [{ scale: activeInnerPulse }], zIndex: -1, opacity: successOpacity }}>
          <Circle size={size} position='inner' green />
        </Animated.View>
        {/* Active Outer */}
        <Animated.View style={{ transform: [{ scale: activeOuterPulse }], zIndex: -2, opacity: successOpacity }}>
          <Circle size={size} position='inner' green />
        </Animated.View>
      </View>
    </>
  )
};
