import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  scrollTo,
  useAnimatedReaction
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture
} from 'react-native-gesture-handler';

import styles from './styles/item';
import { Box } from "../../restyled/Box";
import { ItemProps } from "./types";
import { getPosition, animationConfig, getIndex } from "./config";
import { useLayoutEffect } from "react";

const Item = (props: ItemProps) => {

  const position = getPosition(
    props.positions.value[props.id]!,
    props.size.width,
    (props.size.height + props.rowPadding),
    props.columns
  );

  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);
  const isGestureActive = useSharedValue(false);
  const contentHeight = (Object.keys(props.positions.value).length / props.columns) * (props.size.height + props.rowPadding);

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
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale },
      ],
    };
  });

  useLayoutEffect(() => {
    const pos = getPosition(
      props.positions.value[props.id]!,
      props.size.width,
      props.size.height + props.rowPadding,
      props.columns
    );
    translateX.value = pos.x;
    translateY.value = pos.y;
  }, [props.size]);

  useAnimatedReaction(() => props.positions.value[props.id]!,
    (newOrder) => {
      if (!isGestureActive.value) {
        const pos = getPosition(
          newOrder,
          props.size.width,
          props.size.height + props.rowPadding,
          props.columns
        );
        translateX.value = withTiming(pos.x, animationConfig);
        translateY.value = withTiming(pos.y, animationConfig);
      }
    }
  );

  const pan = Gesture.Pan()
    .activateAfterLongPress(500)
    .onStart((ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
      isGestureActive.value = true;
    })
    .onChange(({ translationX, translationY, changeX, changeY }) => {

      // Don't allow dragging outside the container vertically
      if (translateY.value < 0 || translateY.value > props.containerHeight) {
        const newPosition = getPosition(
          props.positions.value[props.id]!,
          props.size.width,
          props.size.height + props.rowPadding,
          props.columns
        );
        translateY.value = withTiming(newPosition.y, animationConfig);
        return;
      }

      translateX.value += changeX;
      translateY.value += changeY;

      // 1. We calculate where the item should be
      const newIndex = getIndex(
        translateX.value,
        translateY.value,
        Object.keys(props.positions.value).length - 1,
        props.size.width,
        props.size.height + props.rowPadding,
        props.columns
      );

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
      const upperBound = lowerBound + props.containerHeight - props.size.height;
      const maxScroll = contentHeight - props.containerHeight;
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
      const newPosition = getPosition(
        props.positions.value[props.id]!,
        props.size.width,
        props.size.height + props.rowPadding,
        props.columns
      );
      translateX.value = withTiming(newPosition.x, animationConfig, () => {
        isGestureActive.value = false;
        runOnJS(props.onDragEnd)(props.positions.value);
      });
      translateY.value = withTiming(newPosition.y, animationConfig);
    })

  return (
    <Animated.View
      style={style}
      onLayout={(e) => {
        props.size.width = e.nativeEvent.layout.width;
        props.size.height = e.nativeEvent.layout.height;
      }}
    >
      <GestureDetector gesture={pan}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Box
            style={styles.itemContainer}
            shadowColor='mainBackground'
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={isGestureActive.value ? 1 : 0}
            shadowRadius={12}
            elevation={4}
          >
            {props.children}
          </Box>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

export default Item;
