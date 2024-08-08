import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';

import styles from './styles';

export const Spinner = ({ color }: { color?: string }) => {
  const theme = useTheme();
  const pop = useSharedValue(.95);

  useEffect(() => {
    pop.value = withSequence(
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 }),
    )
  }, [])

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pop }] }]}>
      <ActivityIndicator color={color || theme.colors['mainText']} />
    </Animated.View>
  )
}
