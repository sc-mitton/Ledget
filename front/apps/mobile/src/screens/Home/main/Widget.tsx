import { useCallback, useEffect } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  withDelay,
  withRepeat,
  runOnJS,
  scrollTo,
} from "react-native-reanimated";
import { Divider } from 'geist-native-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import styles from './styles/widget';
import { Box, Button, defaultSpringConfig, Icon } from '@ledget/native-ui';
import { getAbsPosition, getNewGridPosition, getGridPositions } from './helpers';
import type { WidgetProps } from './types';
import { widgetsMap } from "./widgetsMap";
import { gap, activeScale } from './constants';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { addWidget, moveWidget, removeWidget, selectWidgets, updateWidget } from '@features/widgetsSlice';

const Widget = (props: WidgetProps) => {
  const WidgetComponent = widgetsMap[props.widget.type];
  const storedWidgets = useAppSelector(selectWidgets);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const initiallyPositioned = useSharedValue(false);
  const isDragging = useSharedValue(0);
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const rotate = useSharedValue(0)
  const deleteButtonOpacity = useSharedValue(0)
  const dragBarOpacity = useSharedValue(0)
  const shadowOpacity = useSharedValue(0)
  const opacity = useSharedValue(props.widget.id ? 1 : 0)
  const scale = useSharedValue(props.widget.id ? 1 : .5)
  const width = useSharedValue(0)
  const column = useSharedValue(0)
  const dragBarPos = useSharedValue(0)

  // Make sure widget is immediately positioned if it's not part of the picker
  useAnimatedReaction(() => props.height, (height) => {
    width.value = props.widget.shape === 'rectangle'
      ? (height.value * 2) + gap
      : height.value;

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

  // Update column
  useAnimatedReaction(() => props.positions, (newPositions) => {
    column.value = newPositions.value[props.widget.id || props.widget.type] % 2;
  });

  // Update the absolute position of the widget when the grid positions change
  // (Only if not dragging, we dont' want the positions updates that happen in the gesture
  // to affect the widget's position)
  useAnimatedReaction(() => props.positions, (newPositions) => {
    if (!isDragging.value) {
      const pos = getAbsPosition(
        newPositions.value[props.widget.id || props.widget.type],
        props.height.value
      );
      translateX.value = withSpring(pos.x, defaultSpringConfig);
      translateY.value = withSpring(pos.y, defaultSpringConfig);

      if (!props.visible) {
        opacity.value = withSpring(0, defaultSpringConfig);
      }
    }
  });

  useAnimatedReaction(() => column.value, (newColumn) => {
    dragBarPos.value = props.widget.shape === 'rectangle'
      ? (props.height.value * 2) + gap
      : newColumn === 0
        ? props.height.value
        : 0
  });

  // Add jitter effect when in editing mode
  useEffect(() => {
    if (props.state === 'editing') {
      dragBarOpacity.value = withTiming(1);
      deleteButtonOpacity.value = withTiming(1);
      rotate.value = withRepeat(withTiming(1, { duration: 100 }), -1, true)
    } else {
      dragBarOpacity.value = withTiming(0);
      deleteButtonOpacity.value = withTiming(0);
      rotate.value = withTiming(0, { duration: 0 })
    }
  }, [props.state])

  useEffect(() => {
    if (!isDragging.value) {
      const pos = getAbsPosition(
        props.positions.value[props.widget.id || props.widget.type],
        props.height.value
      );
      translateX.value = withSpring(pos.x, defaultSpringConfig);
      translateY.value = withSpring(pos.y, defaultSpringConfig);

      if (!props.visible) {
        opacity.value = withSpring(0, defaultSpringConfig);
      }
    }
  }, [props.loaded])

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
      translateY.value = withSpring(pos.y, defaultSpringConfig);
    } else {
      scale.value = withDelay(500, withSpring(.5, defaultSpringConfig));
      opacity.value = withTiming(0, defaultSpringConfig);
      translateY.value = withDelay(500, withSpring(pos.y, defaultSpringConfig));
    }
  }, [props.visible, isDragging.value]);

  const style = useAnimatedStyle(() => {
    const zIndex = isDragging.value ? 100 : 0;
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: width.value,
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
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: deleteButtonOpacity.value,
  }));

  const dragBarStyle = useAnimatedStyle(() => ({
    opacity: dragBarOpacity.value,
    left: dragBarPos.value,
  }));

  const updateGlobalState = useCallback(() => {
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
  }, [props.widget, props.order.value]);

  const dispatchWidgetUpdates = useCallback(() => {
    const currentIndex = props.order.value.findIndex(k => k === props.widget.id || k === props.widget.type);
    const newIndex = column.value === 1 && props.widget.shape === 'square'
      ? currentIndex - 1
      : currentIndex

    dispatch(updateWidget({
      widget: {
        ...props.widget,
        shape: props.widget.shape === 'rectangle'
          ? 'square'
          : 'rectangle'
      },
      index: newIndex
    }))
  }, [props.order.value, column.value, props.widget]);

  const onFinalDelete = useCallback(() => {
    dispatch(removeWidget(props.widget))
  }, []);

  const onDelete = useCallback(() => {
    scale.value = withTiming(0, defaultSpringConfig);
    opacity.value = withTiming(0, defaultSpringConfig, () => {
      runOnJS(onFinalDelete)();
    });
  }, []);

  const pan = Gesture.Pan()
    .activateAfterLongPress(500)
    .failOffsetY(50)
    .failOffsetX([-1 * props.height.value / 2, (props.height.value * 2.5) + gap])
    .onStart((ctx) => {
      props.onDragStart && runOnJS(props.onDragStart)();

      shadowOpacity.value = theme.colors.mode === 'dark' ? withTiming(0.3) : withTiming(.1);
      scale.value = withSpring(activeScale, defaultSpringConfig);

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
          const nextGridPos = props.positions.value[props.order.value[i + 1]]
          const atEnd = i === props.order.value.length - 1

          if (nextGridPos > newGridPos || atEnd) {
            const newOrder = [...props.order.value];
            const widgetKey = props.widget.id || props.widget.type;
            const currentIndex = newOrder.findIndex(k => k === widgetKey);

            // If already in order array, move it, otherwise insert it
            if (currentIndex > -1) {
              newOrder.splice(currentIndex, 1);
              newOrder.splice(i, 0, widgetKey);
            } else if (atEnd) {
              newOrder.splice(i + 1, 0, props.widget.type);
            } else {
              newOrder.splice(i, 0, props.widget.type);
            }

            props.order.value = newOrder;
            break;
          }
        }
      }
    })
    .onChange(({ translationX: tx, translationY: ty, changeX, changeY }) => {
      isDragging.value = 1;

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
          const nextGridPos = props.positions.value[props.order.value[i + 1]]
          const atEnd = i === props.order.value.length - 1

          if (nextGridPos > newGridPos || atEnd) {
            const newOrder = [...props.order.value];
            const widgetKey = props.widget.id || props.widget.type;
            const currentIndex = newOrder.findIndex(k => k === widgetKey);

            // If already in order array, move it, otherwise insert it
            if (currentIndex > -1) {
              newOrder.splice(currentIndex, 1);
              newOrder.splice(i, 0, widgetKey);
            } else if (atEnd) {
              newOrder.splice(i + 1, 0, props.widget.type);
            } else {
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
    .onEnd(({ translationX, translationY }) => {
      shadowOpacity.value = withTiming(0);
      scale.value = withSpring(1, defaultSpringConfig);
      isDragging.value = withDelay(500, withTiming(0, { duration: 0 }));

      const gridPosition = getNewGridPosition(
        props.widget,
        props.positions,
        { x: translateX.value, y: translateY.value },
        props.height.value
      )
      const finalGridPosition = Math.min(
        gridPosition,
        props.positions.value[props.order.value[props.order.value.length - 1]] || 0
      );

      const finalPosition = getAbsPosition(finalGridPosition, props.height.value);

      translateX.value = withSpring(finalPosition.x, defaultSpringConfig);
      translateY.value = withSpring(finalPosition.y, defaultSpringConfig);

      if (translationX > 40 || !props.widget.id) {
        runOnJS(updateGlobalState)();
      }
    })

  const resize = Gesture.Pan()
    .onChange(({ changeX }) => {

      width.value = Math.min(
        Math.max(changeX + width.value, props.height.value),
        (props.height.value * 2) + gap
      );
      dragBarPos.value = Math.min(
        Math.max(changeX + dragBarPos.value, props.height.value),
        (props.height.value * 2) + gap
      );

      // Update ordering/positioning immediately only if it's a square
      if (props.widget.shape === 'square') {
        const currentIndex = props.order.value.findIndex(k => k === props.widget.id || k === props.widget.type);

        const needsUpdating = column.value === 0
          ? (props.positions.value[props.order.value[currentIndex + 1]] - props.positions.value[props.widget.id!]) == 1
          : props.positions.value[props.order.value[currentIndex - 1]] < props.positions.value[props.widget.id!]

        if (!needsUpdating) return;

        // Update positions
        let gridPositions: number[] = [];
        if (column.value === 0) {
          const remappedWidgets = storedWidgets.map(w =>
            w.id === props.widget.id ? { ...w, shape: 'rectangle' as const } : w)
          gridPositions = getGridPositions(remappedWidgets)

          const updatedGridPositions = Object.fromEntries(
            gridPositions.map((pos, index) => [remappedWidgets[index].id, pos] as [string, number]))
          updatedGridPositions[props.widget.id || props.widget.type] = props.positions.value[props.widget.id || props.widget.type];
          props.positions.value = updatedGridPositions;
        } else {
          const widgets = [...storedWidgets];
          widgets[currentIndex] = widgets[currentIndex - 1];
          widgets[currentIndex - 1] = props.widget;
          const remappedWidgets = widgets.map(w =>
            w.id === props.widget.id ? { ...w, shape: 'rectangle' as const } : w)
          gridPositions = getGridPositions(remappedWidgets);

          const updatedGridPositions = Object.fromEntries(
            gridPositions.map((pos, index) => [remappedWidgets[index].id, pos] as [string, number]))
          updatedGridPositions[props.widget.id || props.widget.type] = props.positions.value[props.widget.id || props.widget.type];
          props.positions.value = updatedGridPositions;
        }
      }
    })
    .onEnd(({ translationX: tx, translationY: ty }) => {
      if (Math.abs(tx) > props.height.value / 2) {
        const newSize = props.widget.shape === 'rectangle'
          ? props.height.value
          : (props.height.value * 2) + gap

        width.value = withSpring(newSize, defaultSpringConfig);
        if (props.widget.shape === 'square' && column.value === 1) {
          dragBarPos.value = newSize;
        } else {
          dragBarPos.value = withSpring(newSize, defaultSpringConfig);
        }

        runOnJS(dispatchWidgetUpdates)();
      } else {
        // Abort
        const size = props.widget.shape === 'rectangle'
          ? (props.height.value * 2) + gap
          : props.height.value
        const pos = getAbsPosition(
          props.positions.value[props.widget.id || props.widget.type],
          props.height.value
        );
        translateX.value = withSpring(pos.x, defaultSpringConfig);
        dragBarPos.value = withTiming(size, defaultSpringConfig);
        width.value = withTiming(size, defaultSpringConfig);

        // Put back to original position
        if (props.widget.shape === 'square') {
          const returnedGridPositions = getGridPositions(storedWidgets);
          const returnedPositionsMap = Object.fromEntries(
            returnedGridPositions.map((pos, index) => [storedWidgets[index].id, pos] as [string, number]))
          props.positions.value = returnedPositionsMap;
        }
      }
    })

  return (
    <Animated.View style={style}>
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
                <GestureDetector gesture={pan}>
                  <View style={styles.gestureArea}>
                    <WidgetComponent {...props.widget.args} />
                  </View>
                </GestureDetector>
              </Box>
            </TouchableHighlight>
          </Box>
        </Box>
        <GestureDetector gesture={resize} touchAction={props.state === 'editing' ? 'auto' : 'none'}>
          <Animated.View
            style={[
              styles.dragBarContainer,
              dragBarStyle
            ]}
          >
            <Box
              borderColor='containerDragBar'
              backgroundColor='containerDragBar'
              height={props.height.value / 3}
              borderRadius='xl'
              style={styles.dragBar}
            />
          </Animated.View>
        </GestureDetector>
        <Animated.View
          style={[
            styles.deleteButtonContainer,
            deleteButtonStyle
          ]}
        >
          <Button
            variant='circleButton'
            backgroundColor='redText'
            onPress={onDelete}
            disabled={props.state !== 'editing'}
            icon={<Icon icon={Divider} color='whiteText' size={14} rotate={60} strokeWidth={3} />}
          />
        </Animated.View>
      </Box>
    </Animated.View>
  )
}

export default Widget;
