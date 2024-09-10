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
  cancelAnimation,
  withDelay
} from 'react-native-reanimated';

import styles from './styles';

export const CustomScrollView = forwardRef<ScrollView, ScrollViewProps>((props, ref) => {
  const {
    onContentSizeChange,
    onLayout,
    onScroll,
    showsVerticalScrollIndicator = true
  } = props;
  const { style, ...rest } = props;


  const theme = useTheme();

  const [state, setState] = useState({
    wholeHeight: 0,
    visibleHeight: 0
  });

  const opacity = useSharedValue(0);
  const y = useSharedValue(0);

  const indicatorSize = state.wholeHeight > state.visibleHeight
    ? state.visibleHeight * state.visibleHeight / state.wholeHeight
    : state.visibleHeight

  const difference = state.visibleHeight > indicatorSize ? state.visibleHeight - indicatorSize : 1

  useEffect(() => {
    opacity.value = withTiming(0, { duration: 200 });
  }, []);

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        {...rest}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(width, height) => {
          onContentSizeChange && onContentSizeChange(width, height);
          setState({ ...state, wholeHeight: height });
        }}
        onLayout={(e) => {
          setState({ ...state, visibleHeight: e.nativeEvent.layout.height });
          onLayout && onLayout(e);
        }}
        scrollEventThrottle={16}
        onScroll={(e) => {
          y.value = interpolate(
            e.nativeEvent.contentOffset.y,
            [0, state.wholeHeight - state.visibleHeight],
            [0, difference],
            Extrapolation.CLAMP);
          onScroll && onScroll(e);
        }}
        onScrollBeginDrag={(e) => {
          cancelAnimation(opacity);
          if (e.nativeEvent.contentOffset.y > 0) {
            opacity.value = withTiming(1, { duration: 200 });
          }
        }}
        onScrollEndDrag={(e) => {
          setTimeout(() => {
            opacity.value = withDelay(1000, withTiming(0, { duration: 200 }));
          }, 2000);
        }}
        ref={ref}
      >
      </ScrollView >
      {showsVerticalScrollIndicator &&
        <Animated.View
          style={[
            styles.scrollIndicator,
            {
              height: indicatorSize,
              opacity,
              backgroundColor: theme.colors.scrollbar,
              transform: [{ translateY: y }]
            }]}
        />}
    </View>
  );
});

export default CustomScrollView;

