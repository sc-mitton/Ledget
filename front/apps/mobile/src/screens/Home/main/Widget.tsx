import { useCallback, useEffect } from 'react';
import { TouchableHighlight } from 'react-native';
import { useTheme } from '@shopify/restyle';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  withDelay,
  runOnJS,
  scrollTo,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import styles from './styles/widget';
import { Box, defaultSpringConfig } from '@ledget/native-ui';
import { getAbsPosition, animationConfig, getNewGridPosition } from './helpers';
import type { WidgetProps } from './types';
import { widgetsMap } from "./widgetsMap";
import { gap } from './constants';
import { useAppDispatch } from '@/hooks';
import { addWidget, moveWidget } from '@features/widgetsSlice';

const Widget = (props: WidgetProps) => {
  const initialTranslationY = props.widget.id ? 0 : 200;

  const WidgetComponent = widgetsMap[props.widget.type];
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const initiallyPositioned = useSharedValue(false);
  const isDragging = useSharedValue(0);
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const shadowOpacity = useSharedValue(0)
  const opacity = useSharedValue(props.widget.id ? 1 : 0)
  const scale = useSharedValue(props.widget.id ? 1 : .5)

  // Make sure widget is immediately positioned if it's not part of the picker
  useAnimatedReaction(() => props.height, (height) => {
    if (props.widget.id && !initiallyPositioned.value) {
      const pos = getAbsPosition(
        props.positions.value[props.widget.id],
        height.value
      );
      translateX.value = pos.x;
      translateY.value = pos.y;
      if (height.value > 0) {
        initiallyPositioned.value = true;
      }
    }
  })

  // Update the absolute position of the widget when the grid positions change
  // (Only if not dragging, we dont' want the positions updates that happen in the gesture
  // to affect the widget's position)
  useAnimatedReaction(() => props.positions, (newPositions) => {
    if (!isDragging.value) {
      const pos = getAbsPosition(
        props.positions.value[props.widget.id || props.widget.type],
        props.height.value
      );
      translateX.value = withTiming(pos.x, animationConfig);
      translateY.value = withTiming(pos.y, animationConfig);

      if (!props.visible) {
        opacity.value = 0;
      }
    }
  });


  // Pop in affect for picker
  // This wont end up having any effect for the widgets that are not part of the picker
  useEffect(() => {
    if (isDragging.value) return;

    const pos = getAbsPosition(
      props.positions.value[props.widget.id || props.widget.type],
      props.height.value
    );

    if (props.visible) {
      scale.value = withDelay(props.index * 50, withSpring(1, defaultSpringConfig));
      opacity.value = withDelay(props.index * 50, withSpring(1, defaultSpringConfig));
      translateY.value = withTiming(pos.y, animationConfig);
    } else {
      scale.value = withDelay(500, withSpring(.5, defaultSpringConfig));
      opacity.value = withTiming(0, defaultSpringConfig);
      translateY.value = withDelay(500, withSpring(pos.y + initialTranslationY, defaultSpringConfig));
    }
  }, [props.visible]);

  const style = useAnimatedStyle(() => {
    const zIndex = isDragging.value ? 100 : 0;
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: props.widget.shape === 'rectangle' ? (props.height.value * 2) + gap : props.height.value,
      height: props.height.value,
      opacity: opacity.value,
      zIndex,
      shadowColor: "#000",
      shadowOpacity: shadowOpacity.value,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const onDragEnd = useCallback(() => {
    const index = props.order.value.findIndex(
      k => k === props.widget.id || k === props.widget.type);

    // If the widget is not new, move the widgets position in the global state
    if (props.widget.id) {
      dispatch(moveWidget({ widget: props.widget, index }))
    }
    // Otherwise,insert the widget to the stored widgets global state
    else {
      dispatch(addWidget({ widget: props.widget, index }))
    }
  }, [props.widget]);

  const pan = Gesture.Pan()
    .activateAfterLongPress(500)
    .failOffsetY(50)
    .failOffsetX(-50)
    .onStart((ctx) => {
      props.onDragStart && runOnJS(props.onDragStart)();
      shadowOpacity.value = withTiming(0.3);
      isDragging.value = 1;
      scale.value = withTiming(1.1, defaultSpringConfig);
      ctx.x = translateX.value;
      ctx.y = translateY.value;
      isDragging.value = 1;

      // Shift down grid position by 1000 if needed to indicate part of main screen
      if (props.positions.value[props.widget.id || props.widget.type] > 1000) {
        props.positions.value[props.widget.id || props.widget.type] -= 1000;
      }
    })
    .onChange(({ translationX: tx, translationY: ty, changeX, changeY }) => {

      translateX.value += changeX;
      translateY.value += changeY;

      // 1. Calculate the new grid position
      const newGridPos = getNewGridPosition(
        props.widget,
        props.positions,
        { x: translateX.value, y: translateY.value },
        props.height.value
      );

      // 2. If the grid position is different from what is currently stored
      // then move the widget in the widgets array.

      // Iterate through the widgets array while keeping track of the accumulated grid position.
      // We stick the widget in ordered array based on its grid position.

      if (newGridPos !== props.positions.value[props.widget.id || props.widget.type]) {

        for (let i = 0; i < props.order.value.length; i++) {
          if (props.positions.value[props.widget.id || props.widget.type] >= 1000) {
            continue;
          }

          const nextGridPos = (props.positions.value[props.order.value[i]] + 1)

          if ((nextGridPos > newGridPos) || (i === props.order.value.length - 1)) {
            const newOrder = [...props.order.value];
            const widgetKey = props.widget.id || props.widget.type;
            const currentIndex = newOrder.findIndex(k => k === widgetKey);

            // If already in order array
            if (currentIndex > -1) {
              newOrder.splice(currentIndex, 1);
              newOrder.splice(i, 0, widgetKey);
            }
            // Otherwise, the widget is new and we need to insert it
            else {
              newOrder.splice(i, 0, props.widget.type);
            }

            props.order.value = newOrder;
            break;
          }
        }
      }

      // 3. Scroll up and down if necessary
      const lowerBound = props.scrollY.value;
      const upperBound = lowerBound + props.containerHeight.value - props.height.value;
      const maxScroll = props.scrollHeight - props.containerHeight.value;
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
      scale.value = withTiming(1, defaultSpringConfig);
      isDragging.value = withDelay(500, withTiming(0, { duration: 0 }));

      const newPosition = getAbsPosition(
        props.positions.value[props.widget.id || props.widget.type]!,
        props.height.value
      );
      translateX.value = withSpring(newPosition.x, defaultSpringConfig);
      translateY.value = withSpring(newPosition.y, defaultSpringConfig);

      runOnJS(onDragEnd)();
    })

  return (
    <Animated.View style={style}>
      <GestureDetector gesture={pan}>
        <Box
          style={styles.filled}
          shadowColor='navShadow'
          shadowOpacity={theme.colors.mode === 'dark' ? 0 : .2}
          shadowRadius={12}
          shadowOffset={{ width: 0, height: 2 }}
        >
          <Box
            style={styles.filled}
            shadowColor='navShadow'
            shadowOpacity={.2}
            shadowRadius={2}
            shadowOffset={{ width: 0, height: 2 }}
          >
            <Box style={[styles.filled, styles.clipBox]} borderRadius='xl'>
              <TouchableHighlight
                underlayColor={theme.colors.mainText}
                activeOpacity={.97}
                style={[styles.filled, styles.button]}
                onLongPress={() => { Haptics.selectionAsync() }}
              >
                <Box
                  backgroundColor='nestedContainer'
                  borderRadius='xl'
                  paddingHorizontal='nestedContainerHPadding'
                  paddingVertical='nestedContainerVPadding'
                  style={styles.filled}
                >
                  <WidgetComponent {...props.widget.args} />
                </Box>
              </TouchableHighlight>
            </Box>
          </Box>
        </Box>
      </GestureDetector>
    </Animated.View>
  )
}

export default Widget;
