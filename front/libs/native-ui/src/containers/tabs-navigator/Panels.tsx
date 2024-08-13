import { Dimensions } from 'react-native';
import {
  withTiming,
  withSpring
} from 'react-native-reanimated';

import styles from './styles/styles';
import PagerView from './PagerView';
import { defaultSpringConfig } from '../../animated/configs/configs';
import { useTabsNavigatorContext } from './context';
import type { PagerViewProps } from './types';

function Panels() {
  const {
    setIndex,
    x: pillX,
    width: pillWidth,
    ref: refPagerView,
    dragState,
    layouts,
    tabs,
    props
  } = useTabsNavigatorContext();

  const handleScroll: PagerViewProps['onPageScroll'] = ({ nativeEvent: { position, offset, direction } }) => {

    if (dragState.current === 'dragging') {
      if (direction === -1) {
        // Left swipe
        const delta = (-1 * offset + 1) / (-4 * offset + 5)
        pillWidth.value = layouts.current[position].width + delta * layouts.current[position].width

        if (pillX.value <= layouts.current[position].x && dragState.current === 'dragging') {
          pillX.value = layouts.current[position].x - delta * layouts.current[position].width
        } else {
          pillX.value = withTiming(layouts.current[position].x - delta, { duration: 200 })
        }
      } else {
        // Right swipe
        const delta = (offset / (4 * offset + 1)) * layouts.current[position].width;
        pillWidth.value = layouts.current[position].width + delta
      }
    }

    if (dragState.current === 'settling') {
      pillWidth.value = withTiming(layouts.current[position].width)
      pillX.value = withSpring(layouts.current[position].x, defaultSpringConfig)
    }
  }

  return (
    <PagerView
      style={[styles.pagerView]}
      ref={refPagerView}
      initialPage={0}
      onPageScroll={handleScroll}
      onPageScrollStateChanged={({ nativeEvent }) => {
        dragState.current = nativeEvent.pageScrollState
      }}
      onPageSelected={({ nativeEvent }) => {
        setIndex(nativeEvent.position)
      }}
    >
      {Object.keys(tabs).map((key, i) => {
        const Tab = Object.values(tabs)[i];
        return <Tab key={i} {...props} />
      })}
    </PagerView>
  )
}

export default Panels;
