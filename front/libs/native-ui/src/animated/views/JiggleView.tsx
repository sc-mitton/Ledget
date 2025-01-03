import { useEffect } from 'react';
import { ViewProps } from 'react-native';

import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export const JiggleView = (props: ViewProps & { jiggle: boolean }) => {
  const x = useSharedValue(0);
  const { style, jiggle, ...rest } = props;

  useEffect(() => {
    if (jiggle) {
      x.value = withSequence(
        withTiming(-12, { duration: 100 }),
        withTiming(12, { duration: 100 }),
        withTiming(-7, { duration: 100 }),
        withTiming(7, { duration: 100 }),
        withTiming(-3, { duration: 100 }),
        withTiming(3, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  }, [jiggle]);

  return (
    <Animated.View
      style={[{ transform: [{ translateX: x }] }, style]}
      {...rest}
    >
      {props.children}
    </Animated.View>
  );
};
