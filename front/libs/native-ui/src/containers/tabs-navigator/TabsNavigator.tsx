import { useState, useRef, useCallback } from 'react';
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

const springConfig = {
  mass: 1,
  damping: 24,
  stiffness: 310,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  reduceMotion: ReduceMotion.System,
}

export function TabsNavigator({ screens, seperator = true }: Props) {
  const [index, setIndex] = useState(0);
  const refPagerView = useRef<PagerView>(null);
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const [dragging, setDragging] = useState(false);
  const translateX = useSharedValue(0);

  const layouts = useRef(Array.from({ length: Object.keys(screens).length }, () => ({ width: 0, x: 0 })));

  const animatedStyles = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    transform: [{ translateX: translateX.value }]
  }));

  const handleScroll = ({ nativeEvent }: { nativeEvent: { position: number, offset: number } }) => {

    if (dragging) {
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
    }
  }

  return (
    <>
      <View style={styles.tabBarContainer}>
        <Box style={styles.absTabBar}>
          {Object.keys(screens).map((route, i) => (
            <Button
              key={`${route}${i}`}
              style={styles.tabItem}
              onPress={() => {
                refPagerView.current?.setPage(i)
                setIndex(i)
                width.value = withTiming(layouts.current[i].width)
                translateX.value = withSpring(layouts.current[i].x, springConfig)
              }}
              variant={'transparentPill'}
              textColor={i === index ? 'whiteText' : 'mainText'}
              label={route}
            />
          ))}
        </Box>
        <Animated.View style={[animatedStyles, styles.tabNavPillContainer]}>
          <Box
            style={styles.tabNavPill}
            backgroundColor='tabNavPill'
            borderColor='tabNavPillBorder'
            borderWidth={1.5}
          />
        </Animated.View>
        <Box style={styles.tabBar}>
          {Object.keys(screens).map((route, i) => (
            <Button
              key={`${route}${i}`}
              onLayout={({ nativeEvent }) => {
                layouts.current[i] = {
                  width: nativeEvent.layout.width,
                  x: nativeEvent.layout.x + 20,
                }
                if (i === 0) {
                  width.value = nativeEvent.layout.width;
                  translateX.value = nativeEvent.layout.x + 20;
                  height.value = nativeEvent.layout.height;
                }
              }}
              style={styles.tabItem}
              variant={'grayPill'}
              transparent={true}
              label={route}
            />
          ))}
        </Box>
        {seperator && <Seperator variant='m' />}
      </View>
      <View style={styles.screen}>
        <PagerView
          style={styles.pagerView}
          ref={refPagerView}
          initialPage={0}
          onPageScroll={handleScroll}
          onPageScrollStateChanged={({ nativeEvent }) => {
            setDragging(nativeEvent.pageScrollState !== 'idle')
          }}
          onPageSelected={({ nativeEvent }) => {
            setIndex(nativeEvent.position)
            width.value = withTiming(layouts.current[nativeEvent.position].width)
            translateX.value = withSpring(layouts.current[nativeEvent.position].x, springConfig)
          }}
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

