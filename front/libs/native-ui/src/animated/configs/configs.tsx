import { ReduceMotion } from 'react-native-reanimated';

export const defaultSpringConfig = {
  mass: 1,
  damping: 27,
  stiffness: 315,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  reduceMotion: ReduceMotion.System,
}
