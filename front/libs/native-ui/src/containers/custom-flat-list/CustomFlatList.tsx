import { forwardRef, useRef } from 'react';
import { FlatListProps, FlatList, View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import Animated, {
  useSharedValue,
  interpolate,
  Extrapolation,
  withTiming,
  cancelAnimation,
  withDelay,
} from 'react-native-reanimated';

import styles from './styles';

type CustomFlatListProps<T> = FlatListProps<T> & {
  showsVerticalScrollIndicator?: boolean;
};

export const CustomFlatList = forwardRef<FlatList, CustomFlatListProps<any>>(
  (props, ref) => {
    const {
      onContentSizeChange,
      onLayout,
      onScroll,
      showsVerticalScrollIndicator = true,
      data,
      renderItem,
    } = props;
    const { style, ...rest } = props;

    const theme = useTheme();

    const state = useRef({
      wholeHeight: 0,
      visibleHeight: 0,
    });

    const opacity = useSharedValue(0);
    const y = useSharedValue(0);

    const indicatorSize =
      state.current.wholeHeight > state.current.visibleHeight
        ? (state.current.visibleHeight * state.current.visibleHeight) /
          state.current.wholeHeight
        : state.current.visibleHeight;

    const difference =
      state.current.visibleHeight > indicatorSize
        ? state.current.visibleHeight - indicatorSize
        : 1;

    return (
      <View style={[style]}>
        <FlatList
          {...rest}
          ref={ref}
          data={data}
          renderItem={renderItem}
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
                transform: [{ translateY: y }],
              },
            ]}
          />
        )}
      </View>
    );
  }
);

export default CustomFlatList;
