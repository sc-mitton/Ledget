import { useState, useRef, useEffect } from 'react';
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

interface ScreenProps {
  navigation: any;
  route: any;
}

interface Props {
  screens: { [key: string]: (props: ScreenProps) => React.JSX.Element };
  screenProps: ScreenProps;
  seperator?: boolean;
}

const springConfig = {
  mass: 1,
  damping: 27,
  stiffness: 315,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  reduceMotion: ReduceMotion.System,
}

export function TabsNavigator({ screens, seperator = true, screenProps }: Props) {
  const [index, setIndex] = useState(0);
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const translateX = useSharedValue(0);
  const refPagerView = useRef<PagerView>(null);
  const dragState = useRef<'idle' | 'dragging' | 'settling'>('idle');
  const layouts = useRef(Array.from({ length: Object.keys(screens).length }, () => ({ width: 0, x: 0 })));

  const animatedStyles = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    transform: [{ translateX: translateX.value }]
  }));

  const handleScroll = ({ nativeEvent }: { nativeEvent: { position: number, offset: number } }) => {
    const isLeftSwipe = nativeEvent.position < index;

    if (dragState.current === 'dragging') {
      if (isLeftSwipe) {
        // Left swipe
        const delta = (-1 * nativeEvent.offset + 1) / (-4 * nativeEvent.offset + 5)
        width.value = layouts.current[index].width + delta * layouts.current[index].width

        if (translateX.value <= layouts.current[index].x && dragState.current === 'dragging') {
          translateX.value = layouts.current[index].x - delta * layouts.current[index].width
        } else {
          translateX.value = withTiming(layouts.current[index].x - delta, { duration: 200 })
        }
      } else {
        // Right swipe
        const delta = (nativeEvent.offset / (4 * nativeEvent.offset + 1)) * layouts.current[index].width;
        width.value = layouts.current[index].width + delta
      }
    }

    if (dragState.current === 'settling') {
      const i = isLeftSwipe ?
        nativeEvent.offset < .5 ? index - 1 : index :
        nativeEvent.offset > .5 ? index + 1 : index;
      if (i !== index) {
        setIndex(i)
      } else {
        width.value = withTiming(layouts.current[index].width)
        translateX.value = withSpring(layouts.current[index].x, springConfig)
      }
    }
  }

  useEffect(() => {
    if (dragState.current === 'settling') {
      width.value = withTiming(layouts.current[index].width)
      translateX.value = withSpring(layouts.current[index].x, springConfig)
    }
  }, [index, dragState])

  return (
    <>
      <Box
        backgroundColor='mainBackground'
        shadowColor='tabsShadow'
        shadowOffset={{ width: 0, height: -5 }}
        shadowRadius={20}
        shadowOpacity={.95}
        style={styles.tabBarContainer}>
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
              variant={i === index ? 'transparentPill' : 'grayPill'}
              transparent={true}
              label={route}
            />
          ))}
        </Box>
        {seperator &&
          <View style={styles.seperatorContainer}>
            <Seperator variant='bare' backgroundColor='tabNavBorder' />
          </View>}
      </Box>
      <View style={styles.screen}>
        <PagerView
          style={styles.pagerView}
          ref={refPagerView}
          initialPage={0}
          onPageScroll={handleScroll}
          onPageScrollStateChanged={({ nativeEvent }) => { dragState.current = nativeEvent.pageScrollState }}
          onPageSelected={({ nativeEvent }) => setIndex(nativeEvent.position)}
        >
          {Object.keys(screens).map((key, i) => {
            const Scene = Object.values(screens)[i];
            return <Scene key={i} {...screenProps} />
          })}
        </PagerView>
      </View>
    </>
  );
}

