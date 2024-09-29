import { useRef, forwardRef } from 'react';
import {
  SectionListProps,
  SectionList,
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

type CustomSectionListProps<ItemT, SectionT> = SectionListProps<ItemT, SectionT> & {
  showsVerticalScrollIndicator?: boolean;
};

export const CustomSectionList = forwardRef<SectionList, CustomSectionListProps<any, any>>((props, ref) => {
  const {
    onContentSizeChange,
    onLayout,
    onScroll,
    showsVerticalScrollIndicator = true
  } = props;
  const theme = useTheme();

  const state = useRef({
    wholeHeight: 0,
    visibleHeight: 0
  });

  const opacity = useSharedValue(0);
  const y = useSharedValue(0);

  const indicatorSize =
    state.current.wholeHeight > state.current.visibleHeight
      ? (state.current.visibleHeight * state.current.visibleHeight) / state.current.wholeHeight
      : state.current.visibleHeight;

  const difference = state.current.visibleHeight > indicatorSize ? state.current.visibleHeight - indicatorSize : 1;

  return (
    <View>
      <SectionList
        ref={ref}
        {...props}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(width, height) => {
          onContentSizeChange && onContentSizeChange(width, height);
          state.current.wholeHeight = height;
        }}
        onLayout={(e) => {
          state.current.visibleHeight = e.nativeEvent.layout.height;
          onLayout && onLayout(e);
        }}
        scrollEventThrottle={16}
        onScroll={(e) => {
          y.value = interpolate(
            e.nativeEvent.contentOffset.y,
            [0, state.current.wholeHeight - state.current.visibleHeight],
            [0, difference],
            Extrapolation.CLAMP
          );
          onScroll && onScroll(e);
        }}
        onScrollBeginDrag={() => {
          cancelAnimation(opacity);
          opacity.value = withTiming(1, { duration: 200 });
        }}
        onScrollEndDrag={() => {
          setTimeout(() => {
            opacity.value = withDelay(1000, withTiming(0, { duration: 200 }));
          }, 2000);
        }}
      />
      {showsVerticalScrollIndicator && (
        <Animated.View
          style={[
            styles.scrollIndicator,
            {
              height: indicatorSize,
              opacity,
              backgroundColor: theme.colors.scrollbar,
              transform: [{ translateY: y }]
            }
          ]}
        />
      )}
    </View>
  );
});

export default CustomSectionList;
