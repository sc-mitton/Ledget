import { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  ReduceMotion
} from 'react-native-reanimated';

import styles from './styles';
import { Seperator } from '../../restyled/Seperator';
import { Box } from '../../restyled/Box';
import { Button } from '../../restyled/Button';

interface Props {
  screens: { [key: string]: () => React.JSX.Element };
  seperator?: boolean;
}

export function TabsNavigator({ screens, seperator = true }: Props) {
  const [index, setIndex] = useState(0);
  const refPagerView = useRef<PagerView>(null);
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const translateX = useSharedValue(0);
  const layouts = useRef(Array.from({ length: Object.keys(screens).length }, () => ({ width: 0, x: 0 })));

  const animatedStyles = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    transform: [{ translateX: translateX.value }]
  }));

  useEffect(() => {
    width.value = withTiming(layouts.current[index].width);
    translateX.value = withSpring(layouts.current[index].x, {
      mass: 1,
      damping: 24,
      stiffness: 310,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
      reduceMotion: ReduceMotion.System,
    })
  }, [index]);

  return (
    <>
      <Box style={styles.tabBar}>
        {Object.keys(screens).map((route, i) => (
          <Button
            key={`${route}${i}`}
            onLayout={({ nativeEvent }) => {
              layouts.current[i] = {
                width: nativeEvent.layout.width + 6,
                x: nativeEvent.layout.x - 2,
              }
              if (i === 0) {
                width.value = nativeEvent.layout.width + 6;
                translateX.value = nativeEvent.layout.x - 2;
                height.value = nativeEvent.layout.height;
              }
            }}
            style={styles.tabItem}
            onPress={() => setIndex(i)}
            variant={i === index ? 'transparentPill' : 'grayPill'}
            textColor={i === index ? 'whiteText' : 'mainText'}
            label={route}
          />
        ))}
        <Animated.View style={[animatedStyles, styles.tabNavPillContainer]}>
          <Box
            style={styles.tabNavPill}
            backgroundColor='tabNavPill'
            borderColor='tabNavPillBorder'
            borderWidth={1.5}
          />
        </Animated.View>
      </Box>
      {seperator && <Seperator variant='m' />}
      <View style={styles.screen}>
        <PagerView
          style={styles.pagerView}
          ref={refPagerView}
          initialPage={0}
          onPageScroll={({ nativeEvent }) => {
            // Left swipe
            if (nativeEvent.position < index) {
              const delta = (-1 * nativeEvent.offset + 1) / (-4 * nativeEvent.offset + 5)
              width.value = layouts.current[index].width + delta * layouts.current[index].width
              if (translateX.value <= layouts.current[index].x) {
                translateX.value = layouts.current[index].x - delta * layouts.current[index].width
              } else {
                translateX.value = withTiming(layouts.current[index].x - delta, { duration: 200 })
              }
            }
            // Right swipe
            else {
              const delta = (nativeEvent.offset / (4 * nativeEvent.offset + 1)) * layouts.current[index].width;
              width.value = layouts.current[index].width + delta
            }
          }}
          onPageSelected={({ nativeEvent }) => setIndex(nativeEvent.position)}
        >
          {Object.keys(screens).map((key, i) => {
            const Scene = Object.values(screens)[i];
            return <Scene key={i} />;
          })}
        </PagerView>
      </View>
    </>
  );
}
