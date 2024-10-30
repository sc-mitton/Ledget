import { MutableRefObject } from 'react'
import Animated, { SharedValue, AnimatedRef } from "react-native-reanimated";

import { Widget } from "@features/widgetsSlice";
import { BentoState } from "@types"


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
  onDragEnd?: () => void
  loaded: boolean
  state?: BentoState
}
