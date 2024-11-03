import { MutableRefObject } from 'react'
import Animated, { SharedValue, AnimatedRef } from "react-native-reanimated";

import { Widget } from "@features/widgetsSlice";
import { HomeScreenProps, BentoState } from "@types";

export interface WidgetsBentoProps extends HomeScreenProps<'Main'> { }

export interface WidgetProps {
  widget: Widget
  index: number,
  height: SharedValue<number>,
  positions: SharedValue<{ [id: string]: [number, number] }>,
  order: SharedValue<string[]>,
  scrollView: AnimatedRef<Animated.ScrollView>;
  scrollHeight: number;
  containerHeight: SharedValue<number>;
  scrollY: SharedValue<number>
  onPress?: (id: string) => void
  onDragStart?: () => void
  onDragEnd?: () => void
  state: BentoState
}
