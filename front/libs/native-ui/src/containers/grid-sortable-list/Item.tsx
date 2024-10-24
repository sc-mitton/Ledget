import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  scrollTo,
  useAnimatedReaction,
  useDerivedValue
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture
} from 'react-native-gesture-handler';

import styles from './styles/item';
import { Box } from "../../restyled/Box";
import { ItemProps } from "./types";
import { getPosition, animationConfig, getUpdatedIndex } from "./config";

const Item = (props: ItemProps) => {
  const containerWidth = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isGestureActive = useSharedValue(false);

  const contentHeight = useDerivedValue(() => (
    Object.keys(props.positions.value).length / props.columns) *
    (props.size.value.height + props.rowPadding)
  );

  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = withSpring(isGestureActive.value ? 1.05 : 1);
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: props.size.value.width,
      height: props.size.value.height,
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

  useAnimatedReaction(() => containerWidth.value, (newWidth) => {
    if (!containerWidth.value) return;
    const pos = getPosition(
      props.positions.value[props.id]!,
      props.size.value.width,
      props.size.value.height + props.rowPadding,
      props.columns,
      newWidth
    );
    translateX.value = pos.x;
    translateY.value = pos.y;
  }, []);

  useAnimatedReaction(() => props.positions.value[props.id]!, (newOrder) => {
    if (!containerWidth.value) return;
    if (!isGestureActive.value) {
      const pos = getPosition(
        newOrder,
        props.size.value.width,
        props.size.value.height + props.rowPadding,
        props.columns,
        containerWidth.value
      );
      translateX.value = withTiming(pos.x, animationConfig);
      translateY.value = withTiming(pos.y, animationConfig);
    }
  }
  ), [];

  const pan = Gesture.Pan()
    .activateAfterLongPress(500)
    .failOffsetY(50)
    .failOffsetX(-50)
    .onStart((ctx) => {
      shadowOpacity.value = withTiming(0.3);
      ctx.x = translateX.value;
      ctx.y = translateY.value;
      isGestureActive.value = true;
    })
    .onChange(({ changeX, changeY }) => {

      translateX.value += changeX;
      translateY.value += changeY;

      // 1. We calculate where the item should be
      const newIndex = getUpdatedIndex({
        td: { tx: translateX.value, ty: translateY.value },
        index: props.positions.value[props.id]!,
        max: Object.keys(props.positions.value).length - 1,
        size: { width: props.size.value.width, height: props.size.value.height + props.rowPadding },
        column: props.columns,
        containerWidth: containerWidth.value
      });

      // 2. We swap the positions
      const oldIndex = props.positions.value[props.id];

      if (newIndex !== oldIndex) {
        const idToSwap = Object.keys(props.positions.value).find(
          (key) => props.positions.value[key] === newIndex
        );
        if (idToSwap) {
          // Spread operator is not supported in worklets
          // And Object.assign doesn't seem to be working on alpha.6
          const newPositions = JSON.parse(JSON.stringify(props.positions.value));
          newPositions[props.id] = newIndex;
          newPositions[idToSwap] = oldIndex;
          props.positions.value = newPositions;
        }
      }

      // 3. Scroll up and down if necessary
      const lowerBound = props.scrollY.value;
      const upperBound = lowerBound + props.scrollHeight - props.size.value.height;
      const maxScroll = contentHeight.value - props.scrollHeight;
      const leftToScrollDown = maxScroll - props.scrollY.value;
      if (translateY.value < lowerBound) {
        const diff = Math.min(lowerBound - translateY.value, lowerBound);
        props.scrollY.value -= diff;
        scrollTo(props.scrollView, 0, props.scrollY.value, false);
        changeY += diff;
        translateY.value += changeY;
      }
      if (translateY.value > upperBound) {
        const diff = Math.min(
          translateY.value - upperBound,
          leftToScrollDown
        );
        props.scrollY.value += diff;
        scrollTo(props.scrollView, 0, props.scrollY.value, false);
        changeY += diff;
        translateY.value += changeY;
      }

    })
    .onEnd(() => {
      shadowOpacity.value = withTiming(0);

      const newPosition = getPosition(
        props.positions.value[props.id]!,
        props.size.value.width,
        props.size.value.height + props.rowPadding,
        props.columns,
        containerWidth.value
      );
      translateX.value = withTiming(newPosition.x, animationConfig, () => {
        isGestureActive.value = false;
        runOnJS(props.onDragEnd)(props.positions.value);
      });
      translateY.value = withTiming(newPosition.y, animationConfig);
    })

  return (
    <>
      <View
        style={styles.measure}
        onLayout={({ nativeEvent: e }) => { containerWidth.value = e.layout.width }}
      />
      <Animated.View
        style={style}
        onLayout={(e) => {
          props.size.value.width;
          props.size.value.height = e.nativeEvent.layout.height;
        }}
      >
        <GestureDetector gesture={pan}>
          <Animated.View style={StyleSheet.absoluteFill}>
            <Box style={styles.itemContainer}>
              {props.children}
            </Box>
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </>
  )
}

export default Item;
