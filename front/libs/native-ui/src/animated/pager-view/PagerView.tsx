import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  Children
} from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';
import Reanimated, {
  interpolate,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import styles from './styles/pager-view';
import type { PagerViewProps, TPagerViewRef, DragState } from './types';

const DURATION = 250;

export const PagerView = forwardRef<TPagerViewRef, PagerViewProps>((props, ref) => {
  const {
    onPageScroll,
    onPageScrollStateChanged,
    onPageSelected,
    initialPage,
    children,
    ...rest
  } = props;

  const dragState = useRef<DragState>('idle');
  const page = useRef(initialPage ?? 0);
  const x = useRef(new Animated.Value(0)).current;
  const height = useSharedValue(Dimensions.get('window').height);
  const tabSizes = useRef<{ width: number, height: number }[]>([]);

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 4;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 4;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 4;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 4;
      },
      onPanResponderGrant: (evt, gestureState) => {
        dragState.current = 'dragging';
        onPageScrollStateChanged?.({ nativeEvent: { pageScrollState: 'dragging' } });
      },
      onPanResponderMove: (evt, gs) => {
        if (dragState.current !== 'dragging') return;

        // x.setValue(Dimensions.get('window').width * page.current * -1 + gs.dx / 2);
        x.setValue(
          tabSizes.current.slice(0, page.current).reduce((acc, curr) => acc + curr.width, 0) * -1 + gs.dx
        )
        height.value = withTiming(
          tabSizes.current.reduce((acc, curr, i) => Math.max(acc, curr.height), 0),
          { duration: DURATION }
        );

        const nextPage = gs.dx > 0
          ? Math.max(page.current - 1, 0)
          : Math.min(page.current + 1, (children as any).length - 1);

        if (nextPage === page.current) {
          x.setValue(
            tabSizes.current.slice(0, page.current).reduce((acc, curr) => acc + curr.width, 0) * -1 + gs.dx
          )
        } else if (Math.abs(gs.vx) > 1.5 || Math.abs(gs.dx) > Dimensions.get('window').width / 3) {

          dragState.current = 'settling';
          page.current = nextPage;

          onPageScrollStateChanged?.({ nativeEvent: { pageScrollState: 'settling' } });
          onPageSelected?.({ nativeEvent: { position: nextPage } });

          Animated.timing(x, {
            toValue: tabSizes.current.slice(0, nextPage).reduce((acc, curr) => acc + curr.width, 0) * -1,
            duration: DURATION,
            useNativeDriver: true
          }).start(() => {
            dragState.current = 'idle';
            onPageScrollStateChanged?.({ nativeEvent: { pageScrollState: 'idle' } });
            height.value = withTiming(
              tabSizes.current[page.current].height,
              { duration: DURATION }
            );
          })
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => {
        // Animate to the initial position
        if (dragState.current === 'dragging') {
          dragState.current = 'settling';
          Animated.timing(x, {
            toValue: tabSizes.current.slice(0, page.current).reduce((acc, curr) => acc + curr.width, 0) * -1,
            duration: DURATION,
            useNativeDriver: true
          }).start(() => {
            dragState.current = 'idle';
            onPageScrollStateChanged?.({ nativeEvent: { pageScrollState: 'idle' } });
            height.value = withTiming(
              tabSizes.current[page.current].height,
              { duration: DURATION }
            );
          })
        }
        return true;
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Animate to the initial position
        if (dragState.current === 'dragging') {
          dragState.current = 'settling';
          Animated.timing(x, {
            toValue: tabSizes.current.slice(0, page.current).reduce((acc, curr) => acc + curr.width, 0) * -1,
            duration: DURATION,
            useNativeDriver: true
          }).start(() => {
            dragState.current = 'idle';
            onPageScrollStateChanged?.({ nativeEvent: { pageScrollState: 'idle' } });
            height.value = withTiming(
              tabSizes.current[page.current].height,
              { duration: DURATION }
            );

          })
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    }),
  ).current;

  useImperativeHandle(ref, () => {
    return {
      setPage: (p: number) => {
        page.current = p;
        onPageSelected?.({ nativeEvent: { position: p } });
        height.value = withTiming(
          tabSizes.current.reduce((acc, curr, i) => Math.max(acc, curr.height), 0),
          { duration: DURATION }
        );
        Animated.timing(x, {
          toValue: tabSizes.current.slice(0, p).reduce((acc, curr) => acc + curr.width, 0) * -1,
          duration: DURATION,
          useNativeDriver: true
        }).start(() => {
          height.value = withTiming(
            tabSizes.current[page.current].height,
            { duration: DURATION }
          );
        });
      }
    };
  });

  useEffect(() => {
    const listener = x.addListener(({ value }) => {
      if (dragState.current === 'idle') return;

      const direction = value < Dimensions.get('window').width * page.current * -1 ? 1 : -1;
      const inputRange = direction > 0
        ? [
          tabSizes.current.slice(0, page.current).reduce((acc, curr) => acc + curr.width, 0) * -1,
          tabSizes.current.slice(0, page.current + 1).reduce((acc, curr) => acc + curr.width, 0) * -1
        ]
        : [
          tabSizes.current.slice(0, page.current - 1).reduce((acc, curr) => acc + curr.width, 0) * -1,
          tabSizes.current.slice(0, page.current).reduce((acc, curr) => acc + curr.width, 0) * -1
        ];

      onPageScroll?.({
        nativeEvent: {
          position: page.current,
          direction,
          offset: interpolate(value, inputRange, [0, 1])
        }
      });
    });

    return () => {
      x.removeListener(listener);
    }
  }, []);

  return (
    <View {...rest} {...panResponder.panHandlers}>
      <Reanimated.View style={[{ height }]} >
        <Animated.View style={[styles.pages, { transform: [{ translateX: x }] }]}>
          {Children.map(children, (child, index) => {
            return (
              <View style={[styles.pageContainer]}>
                <View
                  style={styles.page}
                  key={index}
                  onLayout={({ nativeEvent }) => {
                    tabSizes.current[index] = nativeEvent.layout;
                    height.value = tabSizes.current[page.current].height;
                  }}
                >
                  {child}
                </View>
              </View>)
          })}
        </Animated.View>
      </Reanimated.View>
    </View >
  )
});

export default PagerView;
