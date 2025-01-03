import {
  forwardRef,
  useImperativeHandle,
  useRef,
  Children,
  useState,
  useEffect,
} from 'react';
import { View, Dimensions } from 'react-native';
import Reanimated, {
  useSharedValue,
  withTiming,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import styles from './styles/pager-view';
import type { PagerViewProps, TPagerViewRef } from './types';

const DURATION = 300;
const ESCAPE_VELOCITY = 1500;
const GAP = 36;
const ESCAPE_DISTANCE = Dimensions.get('window').width / 3;

export const PagerView = forwardRef<TPagerViewRef, PagerViewProps>(
  (props, ref) => {
    const { onPageSelected, initialPage, children, ...rest } = props;

    const page = useSharedValue(initialPage ?? 0);
    const x = useSharedValue(
      Dimensions.get('window').width * page.value * -1 + page.value * GAP
    );
    const height = useSharedValue(0);
    const [tabSizes, setTabSizes] = useState<
      { width: number; height: number }[]
    >([]);
    const [measured, setMeasured] = useState(false);
    const initialMeasureRef = useRef<View>(null);

    const pan = Gesture.Pan()
      .failOffsetY([0, 0])
      .onStart(({ translationX: tx, velocityX: vx }) => {
        x.value = withTiming(
          Math.min(
            Math.pow(Math.abs(tx), 0.7),
            Math.max(
              tabSizes
                .slice(0, page.value)
                .reduce((acc, curr) => acc + curr.width, 0) *
                -1 +
                tx,
              tabSizes
                .slice(0, tabSizes.length - 1)
                .reduce((acc, curr) => acc + curr.width, 0) *
                -1 -
                Math.pow(Math.abs(tx), 0.7)
            )
          ),
          { duration: 200 }
        );

        const direction = tx < 0 ? 1 : -1;

        const pagePanningTo =
          direction > 0
            ? Math.min(page.value + 1, (children as any).length - 1)
            : Math.max(page.value - 1, 0);
        height.value = withTiming(
          Math.max(tabSizes[pagePanningTo].height, tabSizes[page.value].height),
          { duration: DURATION * (1 - Math.abs(vx) / 2000) }
        );
      })
      .onChange(({ translationX: tx, changeX: chx, velocityX: vx }) => {
        // On page scroll event
        if (Math.abs(vx) > ESCAPE_VELOCITY || Math.abs(tx) > ESCAPE_DISTANCE) {
          const nextPage =
            tx > 0
              ? Math.max(page.value - 1, 0)
              : Math.min(page.value + 1, (children as any).length - 1);
          x.value = withTiming(
            tabSizes
              .slice(0, nextPage)
              .reduce((acc, curr) => acc + curr.width, 0) * -1,
            { duration: DURATION }
          );
          page.value = nextPage;
          onPageSelected &&
            runOnJS(onPageSelected)({ nativeEvent: { position: nextPage } });
        } else {
          x.value = Math.min(
            Math.pow(Math.abs(tx), 0.7),
            Math.max(
              tabSizes
                .slice(0, page.value)
                .reduce((acc, curr) => acc + curr.width, 0) *
                -1 +
                tx,
              tabSizes
                .slice(0, tabSizes.length - 1)
                .reduce((acc, curr) => acc + curr.width, 0) *
                -1 -
                Math.pow(Math.abs(tx), 0.7)
            )
          );
        }
      })
      .onEnd((e) => {
        let updatedX = 0;
        // Revert
        if (
          Math.abs(e.velocityX) < ESCAPE_VELOCITY &&
          Math.abs(e.translationX) < ESCAPE_DISTANCE
        ) {
          updatedX =
            tabSizes
              .slice(0, page.value)
              .reduce((acc, curr) => acc + curr.width, 0) * -1;
          x.value = withTiming(updatedX, { duration: DURATION });
        }
        height.value = withTiming(tabSizes[page.value].height, {
          duration: DURATION,
        });
      });

    useImperativeHandle(ref, () => {
      return {
        setPage: (p: number) => {
          page.value = p;
          onPageSelected?.({ nativeEvent: { position: p } });
          height.value = withTiming(tabSizes[p]?.height, {
            duration: DURATION,
          });
          x.value = withTiming(
            tabSizes.slice(0, p).reduce((acc, curr) => acc + curr.width, 0) *
              -1,
            { duration: DURATION }
          );
        },
      };
    });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        height: height.value || 'auto',
        transform: [{ translateX: x.value }],
      };
    });

    useEffect(() => {
      if (tabSizes.length) {
        height.value = tabSizes[page.value]?.height;
      }
    }, [tabSizes]);

    return (
      <View {...rest}>
        <GestureDetector gesture={pan}>
          <Reanimated.View style={[styles.pages, { gap: GAP }, animatedStyle]}>
            {Children.map(children, (child, index) => {
              return (
                (measured || index === 0) && (
                  <View key={index} style={[styles.pageContainer]}>
                    <View
                      style={styles.page}
                      ref={index === 0 ? initialMeasureRef : undefined}
                      onLayout={({ nativeEvent: ne }) => {
                        if (index === 0 && !measured) {
                          height.value = ne.layout.height;
                          setMeasured(true);
                        }
                        setTabSizes((prev) => {
                          const updated = [...prev];
                          updated[index] = {
                            width: ne.layout.width + GAP,
                            height: ne.layout.height,
                          };
                          return updated;
                        });
                      }}
                    >
                      {child}
                    </View>
                  </View>
                )
              );
            })}
          </Reanimated.View>
        </GestureDetector>
      </View>
    );
  }
);

export default PagerView;
