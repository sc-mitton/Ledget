import { forwardRef, useImperativeHandle, useRef, useEffect, Children } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';
import { interpolate } from 'react-native-reanimated';

import styles from './styles/pager-view'
import { SlideView } from '../slide-view/slide-view';
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
  const x = useRef(new Animated.Value(Dimensions.get('window').width * (initialPage ?? 0) * -1)).current
  const loaded = useLoaded();

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

        x.setValue(Dimensions.get('window').width * page.current * -1 + gs.dx / 2);

        if (Math.abs(gs.vx) > 1 || Math.abs(gs.dx) > Dimensions.get('window').width / 3) {
          const newPage = gs.dx > 0
            ? Math.max(page.current - 1, 0)
            : Math.min(page.current + 1, (children as any).length - 1);

          dragState.current = 'settling';
          page.current = newPage;

          onPageScrollStateChanged?.({ nativeEvent: { pageScrollState: 'settling' } });
          onPageSelected?.({ nativeEvent: { position: newPage } });

          Animated.timing(x, {
            toValue: Dimensions.get('window').width * newPage * -1,
            duration: DURATION,
            useNativeDriver: true
          }).start(() => {
            dragState.current = 'idle';
            onPageScrollStateChanged?.({ nativeEvent: { pageScrollState: 'idle' } });
          })
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => {
        // Animate to the initial position
        if (dragState.current === 'dragging') {
          dragState.current = 'settling';
          Animated.timing(x, {
            toValue: Dimensions.get('window').width * page.current * -1,
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
            toValue: Dimensions.get('window').width * page.current * -1,
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
        page.current = p;
        onPageSelected?.({ nativeEvent: { position: p } });
        Animated.timing(x, {
          toValue: Dimensions.get('window').width * p * -1,
          duration: DURATION,
          useNativeDriver: true
        }).start();
      },
      setPageWithoutAnimation: (p: number) => {
        page.current = p;
        x.setValue(Dimensions.get('window').width * p * -1);
      }
    };
  });

  useEffect(() => {

    const listener = x.addListener(({ value }) => {
      if (dragState.current === 'idle') return;

      const direction = value < Dimensions.get('window').width * page.current * -1 ? 1 : -1;
      const inputRange = direction > 0
        ? [
          Dimensions.get('window').width * page.current * -1,
          Dimensions.get('window').width * (page.current + 1) * -1
        ]
        : [
          Dimensions.get('window').width * (page.current - 1) * -1,
          Dimensions.get('window').width * page.current * -1
        ]

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
    <Animated.View
      style={[
        style,
        {
          transform: [{
            translateX: x
          }]
        },
        styles.pages,
        { width: Dimensions.get('window').width * (children as any).length }
      ]}
      {...rest}
      {...panResponder.panHandlers}
    >
      {Children.map(children, (child, index) => {
        return (
          index === page.current &&
          <SlideView
            key={index}
            skipEnter={!loaded}
            config={{ duration: DURATION }}
            style={{ width: Dimensions.get('window').width }}>
            {child}
          </SlideView>)
      })}
    </Animated.View>
  )
});

export default PagerView;
