import { RefObject } from 'react'
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
  id: string;
  children: Child,
  scrollView: AnimatedRef<Animated.ScrollView>;
  scrollHeight: number;
  scrollY: SharedValue<number>
  positions: SharedValue<Positions>;
  size: SharedValue<{ width: number, height: number }>;
} & Required<SharedProps>

export type GridSortableListProps<TData extends object> = {
  data: TData[]
  renderItem: ({ item, index }: { item: TData, index: number }) => Child
  containerViewStyle?: ViewStyle
  idField?: keyof TData
} & SharedProps

