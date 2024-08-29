import { useEffect } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
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
import { useTheme } from '@shopify/restyle';
import { View } from 'react-native';
import { ColorProps, color, composeRestyleFunctions, useRestyle } from '@shopify/restyle';

import styles from './styles';
import { Box } from '../../restyled/Box';
import { Theme } from '../../theme';


const config = { duration: 1200, easing: Easing.bezier(0.5, 0, 0.5, 1), reduceMotion: ReduceMotion.System }

type RestyleProps = ColorProps<Theme>;
const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([color]);

const ringBoxProps = {
  borderBottomColor: 'transparent',
  borderLeftColor: 'transparent',
  borderTopColor: 'transparent',
} as const;

const Ring = ({ color }: { color: string }) => {
  const theme = useTheme();

  return (
    <View
      style={[{
        borderRightColor: color || theme.colors['mainText'],
        ...ringBoxProps,
      }, styles.ring]}
    />
  )
}

export const IosSpinner = ({ color }: { color: string }) => {

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
    <Animated.View style={[styles.outerRingContainer, { transform: [{ scale: pop }] }]}>
      <View style={styles.ringContainer}>
        <Animated.View style={[styles.animatedRingContainer, a1]}>
          <Ring color={color} />
        </Animated.View>
      </View>
      <View style={styles.ringContainer}>
        <Animated.View style={[styles.animatedRingContainer, a2]}>
          <Ring color={color} />
        </Animated.View>
      </View>
      <View style={styles.ringContainer}>
        <Animated.View style={[styles.animatedRingContainer, a3]}>
          <Ring color={color} />
        </Animated.View>
      </View>
      <View style={styles.ringContainer}>
        <Animated.View style={[styles.animatedRingContainer, a4]}>
          <Ring color={color} />
        </Animated.View>
      </View>
    </Animated.View>
  )
}

export const UnstyledSpinner = ({ color }: { color?: string }) => {
  const theme = useTheme();
  const pop = useSharedValue(.95);

  useEffect(() => {
    pop.value = withSequence(
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 }),
    )
  }, [])

  return (
    <Animated.View style={[
      styles.mainContainer,
      { transform: [{ scale: pop }] }
    ]}>
      <View style={styles.spinnerContainer}>
        {Platform.OS === 'ios'
          ? <IosSpinner color={color || theme.colors['mainText']} />
          : <ActivityIndicator color={color || theme.colors['mainText']} />}
      </View>
    </Animated.View>
  )
}

export const Spinner = (props: RestyleProps) => {
  const restyledProps = useRestyle(restyleFunctions, props);
  const rawColor = (restyledProps as any).color
  const theme = useTheme();

  return <UnstyledSpinner color={rawColor || theme.colors['mainText']} />
}
