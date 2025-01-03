import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';

import styles from './styles';
import { Box } from '../../restyled/Box';
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
  const left = useRef(new Animated.Value(0)).current;
  const tabsTrackWidth = useRef(0);

  useEffect(() => {
    Animated.spring(left, {
      toValue: (tabsTrackWidth.current / props.children.length) * index,
      useNativeDriver: false,
      mass: 1,
      stiffness: 200,
      damping: 25,
    }).start();
    props.onIndexChange(index);
  }, [index]);

  return (
    <View
      style={[
        styles.tabsTrackBoxContainer,
        styles.centeredRow,
        props.containerStyle,
      ]}
    >
      <Box
        backgroundColor="tabsTrack"
        style={[styles.tabsTrackBox, styles.centeredRow]}
      >
        <View
          onLayout={(event) => {
            tabsTrackWidth.current = event.nativeEvent.layout.width;
          }}
          style={[styles.tabsTrack, styles.centeredRow]}
        >
          <TabsTrackContext.Provider value={{ index, setIndex }}>
            {props.children}
          </TabsTrackContext.Provider>
          <Animated.View
            style={[
              styles.indicatorContainer,
              { width: `${100 / props.children.length}%` },
              { left: left },
            ]}
          >
            <Box backgroundColor="tabsBackground" style={styles.indicator} />
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
      style={[styles.tab, styles.centeredRow]}
    >
      {typeof props.children === 'function'
        ? props.children({ selected: index === props.index })
        : props.children}
    </TouchableOpacity>
  );
}

TabsTrack.Tab = Tab;

export default TabsTrack;
