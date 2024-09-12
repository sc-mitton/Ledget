import { ViewProps } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';

export type DragState = 'idle' | 'dragging' | 'settling';

export type TPanels<T> = {
  tabs: { [key: string]: (props: T) => React.JSX.Element };
  props?: T;
  children?: React.ReactNode;
}

export type TContext = {
  index: number;
  setIndex: (index: number) => void;
  x: SharedValue<number>;
  width: SharedValue<number>;
  height: SharedValue<number>;
  ref: React.RefObject<PagerView>;
  dragState: React.MutableRefObject<DragState>;
  layouts: React.MutableRefObject<{ width: number, x: number }[]>;
  length?: number;
} & Omit<TPanels<any>, 'children'>;

export interface PagerViewProps extends ViewProps {
  initialPage?: number;
  onPageScroll?: (e: { nativeEvent: { position: number, offset: number, direction: 1 | -1 } }) => void;
  onPageScrollStateChanged?: (e: { nativeEvent: { pageScrollState: 'idle' | 'dragging' | 'settling' } }) => void;
  onPageSelected?: (e: { nativeEvent: { position: number } }) => void;
}

export type TPagerViewRef = {
  setPage: (page: number) => void;
};
