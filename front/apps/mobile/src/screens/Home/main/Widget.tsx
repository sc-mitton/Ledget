import { View } from "react-native";
import Animated, { SharedValue, AnimatedRef, useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
import { Widget } from "@/features/widgetsSlice";

type Child = React.ReactElement<{ id: string }>

interface WidgetProps {
  index: number
  gridPositions: SharedValue<{ key: Widget['key'], row: number, column: number }[]>
  scrollY: SharedValue<number>
  widget: Widget
  scrollView: AnimatedRef<Animated.ScrollView>;
  children: Child,
  size: { width: number, height: number }
}

const Widget = (props: WidgetProps) => {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const shadowOpacity = useSharedValue(0)
  const isGestureActive = useSharedValue(0)


  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = withSpring(isGestureActive.value ? 1.05 : 1);
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: props.size.width,
      height: props.size.height,
      zIndex,
      shadowColor: "#000",
      shadowOpacity: shadowOpacity.value,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale },
      ],
    };
  });

  return (
    <View>

    </View>
  )
}

export default Widget;
