import { useEffect, useRef } from 'react';
import Animated, { withRepeat, withTiming, withSequence, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { View, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shopify/restyle';

import styles from './styles/shimmer';

export const Shimmer = ({ intensity = 4, style }: { intensity?: number, style?: StyleProp<ViewStyle> }) => {
  const ref = useRef<View>(null)
  const animatedBounds = useRef<[number, number]>()
  const x = useSharedValue(0)
  const theme = useTheme()

  const onLayout = () => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      animatedBounds.current = [-width, width * .25]
    })
  }

  useEffect(() => {
    if (!animatedBounds.current) return
    x.value = withRepeat(withSequence(
      withTiming(animatedBounds.current![0], { duration: 0 }),
      withTiming(animatedBounds.current![1], { duration: 1100 }),
      withTiming(animatedBounds.current![0], { duration: 0 })), -1)
  }, [animatedBounds.current])

  const animation = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }))

  return (
    <View onLayout={onLayout} style={[styles.container, style]} ref={ref}>
      <Animated.View style={[styles.shimmer, animation]}>
        <LinearGradient
          style={[styles.filled, styles.rotated]}
          colors={[
            'transparent',
            theme.colors.mode === 'dark'
              ? `hsla(0, 0%, 60%, ${intensity / 100})`
              : `hsla(0, 0%, 50%, ${intensity / 100})`,
            'transparent'
          ]}
          start={[0, 0]}
          end={[1, 0]}
        />
      </Animated.View>
    </View >
  )
}
