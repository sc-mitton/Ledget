import { useRef, forwardRef } from 'react';
import { SectionListProps, SectionList, View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import Animated, {
  useSharedValue,
  interpolate,
  Extrapolation,
  withTiming,
  cancelAnimation,
  withDelay,
  useDerivedValue,
} from 'react-native-reanimated';

import styles from './styles';

type CustomSectionListProps<ItemT, SectionT> = SectionListProps<
  ItemT,
  SectionT
> & {
  showsVerticalScrollIndicator?: boolean;
  scrollIndicatorPadding?: [number, number];
};

export const CustomSectionList = forwardRef<
  SectionList,
  CustomSectionListProps<any, any>
>((props, ref) => {
  const {
    onContentSizeChange,
    onScroll,
    showsVerticalScrollIndicator = true,
  } = props;
  const theme = useTheme();

  const wholeHeight = useSharedValue(0);
  const visibleHeight = useSharedValue(0);
  const opacity = useSharedValue(0);
  const y = useSharedValue(0);

  const indicatorSize = useDerivedValue(() => {
    return wholeHeight.value > visibleHeight.value
      ? (visibleHeight.value * visibleHeight.value) / wholeHeight.value
      : visibleHeight.value;
  }, [wholeHeight, visibleHeight]);

  const difference = useDerivedValue(() => {
    return visibleHeight.value > indicatorSize.value
      ? visibleHeight.value - indicatorSize.value
      : 1;
  }, [visibleHeight, indicatorSize]);

  return (
    <View style={styles.container}>
      <SectionList
        ref={ref}
        {...props}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(width, height) => {
          onContentSizeChange && onContentSizeChange(width, height);
          wholeHeight.value = height;
        }}
        scrollEventThrottle={16}
        onScroll={(e) => {
          y.value = interpolate(
            e.nativeEvent.contentOffset.y,
            [0, wholeHeight.value - visibleHeight.value],
            [0, difference.value],
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
        <View
          onLayout={(e) => {
            visibleHeight.value = e.nativeEvent.layout.height;
          }}
          style={[
            styles.verticalScrollIndicator,
            {
              top: props.scrollIndicatorPadding
                ? props.scrollIndicatorPadding?.[0]
                : 0,
              bottom: props.scrollIndicatorPadding
                ? props.scrollIndicatorPadding?.[1]
                : 0,
            },
          ]}
        >
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
        </View>
      )}
    </View>
  );
});

export default CustomSectionList;
