import { useState, useEffect, useRef, createContext, useContext } from 'react';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

import styles from './styles';
import { View, TouchableOpacity } from 'react-native';
import { Box } from '../../restyled/Box';
import { Text } from '../../restyled/Text';
import type { TabsTrackProps, TabProps, TabsTrackPropsContext } from './types';
import { defaultSpringConfig } from '../../animated/configs/configs';

const TabsTrackContext = createContext<TabsTrackPropsContext | null>(null);

export function useTabsTrack() {
  const context = useContext(TabsTrackContext);
  if (!context) {
    throw new Error('useTabsTrack must be used within a TabsTrack');
  }
  return context;
}

export function TabsTrack(props: TabsTrackProps) {
  const [index, setIndex] = useState(props.defaultIndex || 0);
  const left = useSharedValue(0);
  const tabsTrackWidth = useRef(0);

  useEffect(() => {
    left.value = withSpring((tabsTrackWidth.current / props.children.length) * index, defaultSpringConfig);
    props.onIndexChange(index);
  }, [index]);

  return (

    <View style={[styles.tabsTrackBoxContainer, styles.centeredRow, props.containerStyle]}>
      <Box
        backgroundColor='tabsTrack'
        style={[styles.tabsTrackBox, styles.centeredRow]}
      >
        <View
          onLayout={(event) => { tabsTrackWidth.current = event.nativeEvent.layout.width }}
          style={[styles.tabsTrack, styles.centeredRow]}
        >
          <TabsTrackContext.Provider value={{ index, setIndex }}>
            {props.children}
          </TabsTrackContext.Provider>
          <Animated.View style={[
            styles.indicatorContainer,
            { width: `${100 / props.children.length}%` },
            { left }
          ]} >
            <Box backgroundColor='tabsBackground' style={styles.indicator} />
          </Animated.View>
        </View>
      </Box>
    </View>
  );
}

function Tab(props: TabProps) {
  const { index, setIndex } = useTabsTrack();

  return (
    <TouchableOpacity
      onPress={() => setIndex(props.index)}
      style={[styles.tab, styles.centeredRow,]}
    >
      {typeof props.children === 'function'
        ? props.children({ selected: index === props.index })
        : props.children}
    </TouchableOpacity>
  )
}

TabsTrack.Tab = Tab;

export default TabsTrack;
