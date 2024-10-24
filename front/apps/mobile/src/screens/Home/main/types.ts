import { MutableRefObject } from 'react'
import Animated, { SharedValue, AnimatedRef } from "react-native-reanimated";

import { Widget } from "@features/widgetsSlice";

type State = 'editing' | 'picking'

export interface WidgetProps {
  widget: Widget
  index: number,
  visible: boolean,
  height: SharedValue<number>,
  positions: SharedValue<{ [id: string]: number }>,
  order: SharedValue<string[]>,
  scrollView: AnimatedRef<Animated.ScrollView>;
  scrollHeight: number;
  containerHeight: SharedValue<number>;
  scrollY: SharedValue<number>
  onPress?: (id: string) => void
  onDragStart?: () => void
  loaded: boolean
  state?: State
}

export interface WidgetsGridProps {
  state?: State
  setState: (state?: State) => void
}
