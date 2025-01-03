import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';

import { Box, BoxProps } from '../restyled/Box';

type PulseBoxProps = {
  height?: 's' | 'reg' | 'm' | 'l';
} & Omit<BoxProps, 'height'>;

const heightMap = {
  s: 10,
  reg: 14,
  m: 24,
  l: 32,
} as { [key: string]: number };

export const PulseBox = (props: PulseBoxProps) => {
  const { height, ...rest } = props;
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      Math.random() * 1500,
      withRepeat(withTiming(0.5, { duration: 1000 }), -1, true)
    );
  }, []);

  return (
    <Animated.View
      style={[{ opacity }, { height: heightMap[height || 'reg'] }]}
    >
      <Box
        borderRadius="xxs"
        backgroundColor="transactionShimmer"
        height={'100%'}
        {...rest}
      />
    </Animated.View>
  );
};

export default PulseBox;
