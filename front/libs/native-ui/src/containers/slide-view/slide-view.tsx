import { ViewProps } from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LayoutAnimationConfig,
} from 'react-native-reanimated';

interface Props extends ViewProps {
  skipEnter?: boolean;
  skipExit?: boolean;
  position?: number;
  config?: { duration: number; delay?: number };
}

export function SlideView(props: Props) {
  const {
    children,
    skipEnter,
    skipExit,
    position,
    config = { duration: 200, delay: 0 },
    ...rest
  } = props;

  return (
    <LayoutAnimationConfig skipEntering={skipEnter} skipExiting={skipExit}>
      <Animated.View
        {...rest}
        entering={FadeInRight.duration(config.duration).delay(
          position! > 0 ? config.duration + (config.delay || 0) : 0
        )}
        exiting={FadeOutLeft.duration(config.duration).delay(
          position! > 0 ? config.duration + (config.delay || 0) : 0
        )}
      >
        {children}
      </Animated.View>
    </LayoutAnimationConfig>
  );
}

export default SlideView;
