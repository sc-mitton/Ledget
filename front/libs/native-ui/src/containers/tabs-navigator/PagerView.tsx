import { forwardRef, useImperativeHandle, useRef, useEffect, Children } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';
import { interpolate } from 'react-native-reanimated';

import type { PagerViewProps, TPagerViewRef, DragState } from './types';
import { useLoaded } from '@ledget/helpers';

const DURATION = 250;

const PagerView = forwardRef<TPagerViewRef, PagerViewProps>((props, ref) => {
  const {
    onPageScroll,
    onPageScrollStateChanged,
    onPageSelected,
    initialPage,
    children,
    style,
    ...rest
  } = props;

  const dragState = useRef<DragState>('idle');
  const page = useRef(initialPage ?? 0);
  const swipeDirection = useRef<'left' | 'right'>('left');
  const x = useRef(new Animated.Value(0)).current
  const pageX = useRef(new Animated.Value(0)).current

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

        swipeDirection.current = gs.dx > 0 ? 'right' : 'left';
        x.setValue(gs.dx / 2);

        const newPage = gs.dx > 0
          ? Math.max(page.current - 1, 0)
          : Math.min(page.current + 1, (children as any).length - 1);

        if (newPage === page.current) {
          x.setValue(Math.pow(Math.abs(gs.dx), .5) * Math.sign(gs.dx));
        } else if (Math.abs(gs.vx) > 1.5 || Math.abs(gs.dx) > Dimensions.get('window').width / 3) {

          dragState.current = 'settling';
          page.current = newPage;

          onPageScrollStateChanged?.({ nativeEvent: { pageScrollState: 'settling' } });
          onPageSelected?.({ nativeEvent: { position: newPage } });
          x.setValue(0);
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => {
        // Animate to the initial position
        if (dragState.current === 'dragging') {
          dragState.current = 'settling';
          Animated.timing(x, {
            toValue: 0,
            duration: DURATION,
            useNativeDriver: true
          }).start(() => {
            dragState.current = 'idle';
            onPageScrollStateChanged?.({ nativeEvent: { pageScrollState: 'idle' } });
          })
        }
        return true;
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Animate to the initial position
        if (dragState.current === 'dragging') {
          dragState.current = 'settling';
          Animated.timing(x, {
            toValue: 0,
            duration: DURATION,
            useNativeDriver: true
          }).start(() => {
            dragState.current = 'idle';
            onPageScrollStateChanged?.({ nativeEvent: { pageScrollState: 'idle' } });
          })
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    }),
  ).current;

  useImperativeHandle(ref, () => {
    return {
      setPage: (p: number) => {
        swipeDirection.current = p > page.current ? 'left' : 'right';
        page.current = p;
        onPageSelected?.({ nativeEvent: { position: p } });
      }
    };
  });

  useEffect(() => {

    const listener = x.addListener(({ value }) => {
      if (dragState.current === 'idle') return;

      const inputRange = value < 0
        ? [0, Dimensions.get('window').width * -1]
        : [Dimensions.get('window').width, 0]

      onPageScroll?.({
        nativeEvent: {
          position: page.current,
          direction: value < 0 ? 1 : -1,
          offset: interpolate(value, inputRange, [0, 1])
        }
      });
    });

    return () => {
      x.removeListener(listener);
    }
  }, []);

  return (
    <Animated.View
      style={[
        style,
        { transform: [{ translateX: x }] }
      ]}
      {...rest}
      {...panResponder.panHandlers}
    >
      {Children.map(children, (child, index) => {
        return (
          index === page.current &&
          (
            <Animated.View
              key={`page-${index}`}
              style={{
                minHeight: Dimensions.get('window').height / 2,

              }}
            >
              {child}
            </Animated.View>
          )
        )
      })}
    </Animated.View>
  )
});

export default PagerView;
