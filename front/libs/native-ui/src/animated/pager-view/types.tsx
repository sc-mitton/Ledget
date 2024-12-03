import { ViewProps } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

export type DragState = 'idle' | 'dragging' | 'settling';

export type TPanels<T> = {
  tabs: { [key: string]: (props: T) => React.JSX.Element };
  children?: React.ReactNode;
} & (T extends object ? { props: T } : { props?: never });

export type TContext = {
  index: number;
  setIndex: (index: number) => void;
  x: SharedValue<number>;
  width: SharedValue<number>;
  height: SharedValue<number>;
  ref: React.RefObject<TPagerViewRef>;
  dragState: React.MutableRefObject<DragState>;
  layouts: React.MutableRefObject<{ width: number, x: number }[]>;
  length?: number;
} & Omit<TPanels<any>, 'children'>;

export interface PagerViewProps extends ViewProps {
  initialPage?: number;
  pageMargin?: number;
  onPageSelected?: (e: { nativeEvent: { position: number } }) => void;
}

export type TPagerViewRef = {
  setPage: (page: number) => void;
};
