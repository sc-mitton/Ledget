import { useState, forwardRef, useRef, useEffect } from 'react';
import {
  ScrollViewProps,
  ScrollView,
  View
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import Animated, {
  useSharedValue,
  interpolate,
  Extrapolation,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

import styles from './styles';

interface Props extends ScrollViewProps {
  peekabooScrollIndicator?: boolean;
}

export const CustomScrollView = forwardRef<ScrollView, Props>((props, ref) => {
  const {
    onContentSizeChange,
    onLayout,
    onScroll,
    peekabooScrollIndicator = true,
    showsVerticalScrollIndicator = true,
    showsHorizontalScrollIndicator = true,
  } = props;
  const { style, ...rest } = props;

  const theme = useTheme();

  const [state, setState] = useState({
    wholeHeight: 0,
    wholeWidth: 0,
    visibleWidth: 0,
    visibleHeight: 0
  });

  const opacity = useSharedValue(100);
  const y = useSharedValue(0);
  const x = useSharedValue(0);

  const indicatorSize = props.horizontal
    ? state.wholeWidth > state.visibleWidth
      ? state.visibleWidth * state.visibleWidth / state.wholeWidth
      : state.visibleWidth
    : state.wholeHeight > state.visibleHeight
      ? state.visibleHeight * state.visibleHeight / state.wholeHeight
      : state.visibleHeight;

  const difference = props.horizontal
    ? state.visibleWidth > indicatorSize ? state.visibleWidth - indicatorSize : 1
    : state.visibleHeight > indicatorSize ? state.visibleHeight - indicatorSize : 1;

  useEffect(() => {
    if (peekabooScrollIndicator) {
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, []);

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        {...rest}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(width, height) => {
          onContentSizeChange && onContentSizeChange(width, height);
          if (props.horizontal) {
            setState({ ...state, wholeWidth: width });
          } else {
            setState({ ...state, wholeHeight: height });
          }
        }}
        onLayout={(e) => {
          if (props.horizontal) {
            setState({ ...state, visibleWidth: e.nativeEvent.layout.width });
          } else {
            setState({ ...state, visibleHeight: e.nativeEvent.layout.height });
          }
          onLayout && onLayout(e);
        }}
        scrollEventThrottle={16}
        onScroll={(e) => {
          if (props.horizontal) {
            x.value = interpolate(
              e.nativeEvent.contentOffset.x,
              [0, state.wholeWidth - state.visibleWidth],
              [0, difference],
              Extrapolation.CLAMP);
          } else {
            y.value = interpolate(
              e.nativeEvent.contentOffset.y,
              [0, state.wholeHeight - state.visibleHeight],
              [0, difference],
              Extrapolation.CLAMP);
          }
          onScroll && onScroll(e);
        }}
        onScrollBeginDrag={(e) => {
          opacity.value = withTiming(1, { duration: 200 });
        }}
        onScrollEndDrag={(e) => {
          setTimeout(() => {
            opacity.value = withDelay(
              1000,
              withTiming(
                peekabooScrollIndicator ? 0 : 1,
                { duration: 200 }
              )
            );
          }, 2000);
        }}
        ref={ref}
      >
      </ScrollView >
      {
        showsVerticalScrollIndicator &&
        < Animated.View
          style={[
            props.horizontal ? styles.horizontalScrollIndicator : styles.verticalscrollIndicator,
            {
              height: props.horizontal ? 4 : indicatorSize,
              width: props.horizontal ? indicatorSize : 4,
              opacity,
              backgroundColor: theme.colors.scrollbar,
              transform: [
                { translateY: y },
                { translateX: x }
              ],
            }]}
        />
      }
    </View >
  );
});

export default CustomScrollView;
