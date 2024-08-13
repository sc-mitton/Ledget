import { useState, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';

import Panels from './Panels';
import Tabs from './Tabs';
import TabsNavigatorContext from './context';
import { TPanels } from './types';


function TabsNavigator<T>(props: TPanels<T>) {
  const { children, tabs, props: tabProps } = props;

  const [index, setIndex] = useState(0);
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const translateX = useSharedValue(0);
  const refPagerView = useRef<PagerView>(null);
  const dragState = useRef<'idle' | 'dragging' | 'settling'>('idle');
  const layouts = useRef(Array.from({ length: Object.keys(tabs).length }, () => ({ width: 0, x: 0 })));

  return (
    <TabsNavigatorContext.Provider value={{
      index,
      setIndex,
      x: translateX,
      width,
      height,
      ref: refPagerView,
      dragState,
      layouts,
      props: tabProps,
      tabs
    }}>
      {children}
    </TabsNavigatorContext.Provider>
  )
}

TabsNavigator.Tabs = Tabs;
TabsNavigator.Panels = Panels;

export { TabsNavigator };
