import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

import styles from './styles/shared';
import { Seperator } from '../../restyled/Seperator';
import { Box } from '../../restyled/Box';
import { Button } from '../../restyled/Button';
import { defaultSpringConfig } from '../../animated/configs/configs';
import { useTabsNavigatorContext } from './context';

const Tabs = ({ seperator = true }: { seperator?: boolean }) => {
  const {
    index,
    x: translateX,
    width,
    height,
    ref: refPagerView,
    dragState,
    layouts,
    tabs
  } = useTabsNavigatorContext();

  const animatedStyles = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    transform: [{ translateX: translateX.value }]
  }));

  useEffect(() => {
    if (dragState.current === 'settling') {
      width.value = withTiming(layouts.current[index].width)
      translateX.value = withSpring(layouts.current[index].x, defaultSpringConfig)
    }
  }, [index, dragState])

  return (
    <View style={styles.tabBarContainer}>
      <Box backgroundColor='mainBackground'>
        {/* Text Only */}
        <Box style={styles.absTabBar}>
          {Object.keys(tabs).map((tab, i) => (
            <Button
              key={`${tab}${i}`}
              style={styles.tabItem}
              onPress={() => {
                refPagerView.current?.setPage(i)
                width.value = withTiming(layouts.current[i].width)
                translateX.value = withSpring(layouts.current[i].x, defaultSpringConfig)
              }}
              variant={'transparentPill'}
              textColor={i === index ? 'whiteText' : 'mainText'}
              label={tab}
            />
          ))}
        </Box>
        {/* Active Indicator */}
        <Animated.View style={[animatedStyles, styles.tabNavPillContainer]}>
          <Box
            style={styles.tabNavPill}
            backgroundColor='tabNavPill'
            borderColor='tabNavPillBorder'
            borderWidth={1.5}
          />
        </Animated.View>
        {/* Backgrounds */}
        <Box style={styles.tabBar}>
          {Object.keys(tabs).map((tab, i) => (
            <Button
              key={`${tab}${i}`}
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
              label={tab}
            />
          ))}
        </Box>
        {seperator &&
          <View style={styles.seperatorContainer}>
            <Seperator variant='bare' backgroundColor='tabNavBorder' />
          </View>}
      </Box>
      <Box
        style={styles.shadow}
        backgroundColor='mainBackground'
      />
    </View>
  )
}

export default Tabs;

