import { ViewStyle } from 'react-native'
import Animated, { AnimatedRef, SharedValue } from 'react-native-reanimated'

type SharedProps = {
  columns?: number
  rowPadding?: number
  onDragEnd?: (diffs: Positions) => void;
}

export type Positions = {
  [id: string]: number;
}

type Child = React.ReactElement<{ id: string }>

export type ItemProps = {
  scrollView: AnimatedRef<Animated.ScrollView>;
  scrollY: SharedValue<number>
  id: string;
  children: Child,
  positions: SharedValue<Positions>;
  containerSize: {
    width: number;
    height: number;
  };
  size: {
    width: number;
    height: number;
  }
} & Required<SharedProps>

export type GridSortableListProps<TData extends object> = {
  data: TData[]
  renderItem: ({ item, index }: { item: TData, index: number }) => Child
  containerViewStyle?: ViewStyle
  idField?: keyof TData
} & SharedProps

