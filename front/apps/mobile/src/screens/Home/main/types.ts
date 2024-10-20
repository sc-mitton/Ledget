import { RefObject } from 'react'
import Animated, { SharedValue, AnimatedRef } from "react-native-reanimated";

import { Widget } from "@features/widgetsSlice";

export interface WidgetProps {
  widget: Widget
  index: number,
  height: number,
  visible: boolean,
  positions: SharedValue<{ [id: string]: number }>,
  scrollY: SharedValue<number>
  scrollView: AnimatedRef<Animated.ScrollView>
  onPress?: (id: string) => void
  onLongPress?: (id: string) => void
}
