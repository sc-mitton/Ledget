import { useCallback, useEffect } from 'react';
import { TouchableHighlight, View, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  runOnJS,
  scrollTo
} from "react-native-reanimated";
import { Divider } from 'geist-native-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import styles from './styles/widget';
import { Box, Button, defaultSpringConfig, Icon, Text } from '@ledget/native-ui';
import { getAbsPosition, getNewGridPosition, getGridPositions } from './helpers';
import type { WidgetProps } from './types';
import { widgetsMap } from "./widgetsMap";
import { gap, activeScale } from './constants';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { addWidget, removeWidget, selectWidgets, updateWidget } from '@features/widgetsSlice';

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
  const overlayOpacity = useSharedValue(0)
  const deleteButtonOpacity = useSharedValue(0)
  const dragBarOpacity = useSharedValue(0)
  const shadowOpacity = useSharedValue(0)
  const opacity = useSharedValue(props.widget.id ? 1 : 0)
  const scale = useSharedValue(props.widget.id ? 1 : .5)
  const width = useSharedValue(0)
  const column = useSharedValue(0)
  const dragBarPos = useSharedValue(0)

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: deleteButtonOpacity.value,
  }));

  const dragBarStyle = useAnimatedStyle(() => ({
    opacity: dragBarOpacity.value,
    left: dragBarPos.value,
  }));

  // Make sure widget is immediately positioned if it's not part of the picker
  useAnimatedReaction(() => props.height, (height) => {
    width.value = props.widget.shape === 'rectangle' && props.widget.id
      ? (height.value * 2) + gap
      : height.value;

    if (props.widget.id && !initiallyPositioned.value) {
      const pos = getAbsPosition(
        props.positions.value[props.widget.id][0],
        height.value,
        !Boolean(props.widget.id)
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
  // to affect the widget's position if it's being dragged around)
  useAnimatedReaction(() => props.positions, (newPositions) => {
    if (!isDragging.value && newPositions.value[props.widget.id || props.widget.type]) {
      // Update column
      column.value = newPositions.value[props.widget.id || props.widget.type][0] % 2;

      const pos = getAbsPosition(
        newPositions.value[props.widget.id || props.widget.type][0],
        props.height.value,
        !Boolean(props.widget.id)
      );

      translateX.value = withSpring(pos.x, defaultSpringConfig);
      translateY.value = withSpring(pos.y, defaultSpringConfig);
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
      deleteButtonOpacity.value = withTiming(1, { duration: 200 })
      dragBarOpacity.value = withTiming(1, { duration: 200 })
      rotate.value = withRepeat(withTiming(1, { duration: 100 }), -1, true)
      overlayOpacity.value = withTiming(.95, { duration: 200 })
    } else {
      deleteButtonOpacity.value = withTiming(0, { duration: 200 })
      dragBarOpacity.value = withTiming(0, { duration: 200 })
      rotate.value = withTiming(0, { duration: 0 })
      overlayOpacity.value = withTiming(0, { duration: 200 })
    }
  }, [props.state])

  // Immediate positioning if necessary for set widgets (ie has id)
  useEffect(() => {
    if (props.widget.id && props.positions.value[props.widget.id]) {
      const pos = getAbsPosition(
        props.positions.value[props.widget.id][0],
        props.height.value,
        !Boolean(props.widget.id)
      );
      translateX.value = withSpring(pos.x, defaultSpringConfig);
      translateY.value = withSpring(pos.y, defaultSpringConfig);
    }
  }, [])

  // Pop in affect for widget (only picker widgets)
  // This wont end up having any effect for the widgets that are not part of the picker
  useEffect(() => {
    if (isDragging.value || props.widget.id || !props.positions.value[props.widget.type]) return;

    const pos = getAbsPosition(
      props.positions.value[props.widget.type][0],
      props.height.value,
      !Boolean(props.widget.id)
    );

    if (props.state === 'picking') {
      scale.value = withDelay(props.index * 50, withSpring(1, defaultSpringConfig));
      opacity.value = withDelay(props.index * 50, withSpring(1, defaultSpringConfig));
      translateY.value = withSpring(pos.y, defaultSpringConfig);
    } else {
      scale.value = withDelay(500, withSpring(.5, defaultSpringConfig));
      opacity.value = withTiming(0, defaultSpringConfig);
      translateY.value = withDelay(500, withSpring(pos.y, defaultSpringConfig));
    }
  }, [props.state]);

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

  const updateGlobalState = useCallback(() => {
    const index = props.order.value.findIndex(k => k === props.widget.id || k === props.widget.type);

    // Add widget if it's new
    if (!props.widget.id) {
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
    .activateAfterLongPress(200)
    .enabled(props.state !== 'idle')
    .failOffsetY(50)
    .failOffsetX([-1 * props.height.value / 2, (props.height.value * 2.5) + gap])
    .onStart((ctx) => {
      runOnJS(Haptics.selectionAsync)();

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

      const shouldMove = [
        newGridPos[0] !== props.positions.value[props.widget.id || props.widget.type][0],
        !Boolean(props.widget.id)
      ]
      if (shouldMove.every(Boolean)) {

        for (let i = 0; i < props.order.value.length; i++) {
          const nextGridPos = props.positions.value[props.order.value[i + 1]]
          const atEnd = i === props.order.value.length - 1

          if (nextGridPos > newGridPos || atEnd) {
            const newOrder = [...props.order.value];
            if (atEnd) {
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
      if (newGridPos[0] !== props.positions.value[props.widget.id || props.widget.type][0]) {

        const iterator = Array.from({ length: props.order.value.length }, (_, i) =>
          (changeY > 0 || changeX > 0) ? i : props.order.value.length - 1 - i)

        for (const i of iterator) {

          const nextGridPos = props.positions.value[props.order.value[i]]
          const direction = changeY > 0 || changeX > 0 ? 1 : -1

          const initiateReorder = direction > 0
            ? props.widget.shape === 'rectangle'
              ? nextGridPos && nextGridPos[0] + nextGridPos[1] - 1 >= newGridPos[0] + 1
              : nextGridPos && nextGridPos[0] >= newGridPos[0]
            : props.widget.shape === 'rectangle'
              ? nextGridPos && nextGridPos[0] - nextGridPos[1] + 1 <= newGridPos[0]
              : nextGridPos && nextGridPos[0] <= newGridPos[0]

          if (initiateReorder) {

            const newOrder = [...props.order.value];
            const widgetKey = props.widget.id || props.widget.type;
            const currentIndex = props.order.value.findIndex(k => k === widgetKey);
            const hasSquareNeighbor = currentIndex === props.order.value.length - 1 ? false
              : column.value === 0
                ? props.positions.value[props.order.value[currentIndex + 1]][1] === 1
                : props.positions.value[props.order.value[currentIndex - 1]][1] === 1

            // If already in order array, move it, otherwise insert it
            if (currentIndex > -1) {
              // If swapping square with rectangle, then move square
              // neighbor with it if there is one
              if (hasSquareNeighbor && newGridPos[1] === 1 && nextGridPos[1] === 2) {
                const startSnip = column.value === 0 ? currentIndex : currentIndex - 1;
                const snipped = newOrder.splice(startSnip, 2);
                const targetIndex = direction > 0 ? i - 1 : i;
                newOrder.splice(targetIndex, 0, ...snipped);
              } else {
                newOrder.splice(currentIndex, 1);
                newOrder.splice(i, 0, widgetKey);
              }
            } else {
              newOrder.splice(i, 0, widgetKey);
            }

            props.order.value = newOrder;
            break;
          }
        }
      }

      // 3. Scroll up and down if necessary
      const lowerBound = props.scrollY.value;
      const upperBound = lowerBound + props.containerHeight.value - theme.spacing.navHeight - (props.height.value * .75);
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
      props.onDragEnd && runOnJS(props.onDragEnd)();
      shadowOpacity.value = withTiming(0);
      isDragging.value = withDelay(1500, withTiming(0, { duration: 0 }));

      const gridPosition = getNewGridPosition(
        props.widget,
        props.positions,
        { x: translateX.value, y: translateY.value },
        props.height.value
      )

      const finalGridPosition = Math.min(
        gridPosition[0],
        props.positions.value[props.order.value[props.order.value.length - 1]]?.[0] || 0
      );

      const finalPosition = getAbsPosition(finalGridPosition, props.height.value);
      finalPosition.y = props.widget.id ? finalPosition.y : finalPosition.y + props.scrollY.value;

      // Sending dragged widget back to where it belongs after done dragging
      // if it's a new widget (ie no id)
      if (!props.widget.id) {
        const returnPos = getAbsPosition(
          props.positions.value[props.widget.id || props.widget.type][0],
          props.height.value,
          !Boolean(props.widget.id)
        );

        column.value = finalGridPosition % 2;

        translateX.value = withSequence(
          withSpring(finalPosition.x, defaultSpringConfig),
          withDelay(1500, withTiming(returnPos.x, { duration: 0 }))
        )
        translateY.value = withSequence(
          withSpring(finalPosition.y, defaultSpringConfig),
          withDelay(1500, withTiming(returnPos.y, { duration: 0 }))
        )
      } else {
        translateX.value = withSpring(finalPosition.x, defaultSpringConfig);
        translateY.value = withSpring(finalPosition.y, defaultSpringConfig);
      }

      // Hide widget after placement if it's being dropped into place after picking
      if (!props.widget.id) {
        opacity.value = withDelay(1000, withTiming(0, { duration: 0 }));
        scale.value = withSequence(
          withSpring(1, defaultSpringConfig),
          withDelay(1500, withTiming(.5, { duration: 0 }))
        )
      } else {
        scale.value = withSpring(1, defaultSpringConfig)
      }

      // Used to make sure we don't unecessarily update the global state
      if (Math.abs(translationX) > 40 || Math.abs(translationY) > 40 || !props.widget.id) {
        runOnJS(updateGlobalState)();
      }

    })

  const resize = Gesture.Pan()
    .enabled(props.state === 'editing')
    .onChange(({ changeX }) => {
      const widthDx = column.value === 0 ? changeX : -1 * changeX;
      width.value = Math.min(
        Math.max(widthDx + width.value, props.height.value),
        (props.height.value * 2) + gap
      );
      if (column.value === 0) {
        dragBarPos.value = Math.min(
          Math.max(changeX + dragBarPos.value, props.height.value),
          (props.height.value * 2) + gap
        );
      }

      // Translate it sideways also if in the right column and square
      if (props.widget.shape === 'square' && column.value === 1) {
        translateX.value = Math.min(
          Math.max(changeX + translateX.value, 0),
          props.height.value + gap
        )
      }

      // Update ordering/positioning immediately only if it's a square
      if (props.widget.shape === 'square') {
        const currentIndex = props.order.value.findIndex(k => k === props.widget.id || k === props.widget.type);

        // Do we need to move around other widgets? - Yes if there is a square neighbor
        const needsUpdating = column.value === 0
          ? ((props.positions.value[props.order.value[currentIndex + 1]]?.[0] || 0) - (props.positions.value[props.widget.id!]?.[0] || 0)) == 1
          : props.positions.value[props.order.value[currentIndex - 1]] < props.positions.value[props.widget.id!]

        if (!needsUpdating) return;

        // Update positions
        let gridPositions: [number, number][] = [];

        if (column.value === 0) {
          const remappedWidgets = storedWidgets.map(w =>
            w.id === props.widget.id ? { ...w, shape: 'rectangle' as const } : w)
          gridPositions = getGridPositions(remappedWidgets)

          const updatedGridPositions = Object.fromEntries(
            gridPositions.map((pos, index) => [remappedWidgets[index].id, pos]))
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
            gridPositions.map((pos, index) => [remappedWidgets[index].id, pos]))
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
        translateX.value = withSpring(0, defaultSpringConfig);

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
        const pos = getAbsPosition(props.positions.value[props.widget.id || props.widget.type][0], props.height.value);
        translateX.value = withSpring(pos.x, defaultSpringConfig);
        width.value = withTiming(size, defaultSpringConfig);
        if (column.value === 0) {
          dragBarPos.value = withTiming(size, defaultSpringConfig);
        }

        // Put back to original position
        if (props.widget.shape === 'square') {
          const returnedGridPositions = getGridPositions(storedWidgets);
          const returnedPositionsMap = Object.fromEntries(
            returnedGridPositions.map((pos, index) => [storedWidgets[index].id, pos]))
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
            <GestureDetector gesture={pan}>
              <Animated.View
                style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}
                pointerEvents={props.state === 'idle' ? 'none' : 'auto'}
              >
                <Box backgroundColor='nestedContainer' style={[StyleSheet.absoluteFill, styles.overlay]} />
              </Animated.View>
            </GestureDetector>
            <TouchableHighlight
              underlayColor={theme.colors.mainText}
              activeOpacity={.98}
              delayPressIn={200}
              style={[styles.filled, styles.button]}
              disabled={Boolean(props.widget.id)}
              onLongPress={() => { }}
            >
              <Box
                backgroundColor='nestedContainer'
                borderRadius='xl'
                paddingHorizontal='nestedContainerHPadding'
                paddingVertical='nestedContainerHPadding'
                style={styles.filled}
              >

                <View
                  style={styles.gestureArea}
                  pointerEvents={props.state === 'editing' ? 'none' : 'auto'}
                >
                  <WidgetComponent {...props.widget} />
                </View>
              </Box>
            </TouchableHighlight>
          </Box>
        </Box>
        {props.state === 'picking' && !props.widget.id &&
          <View style={styles.labelContainer}>
            <Text style={styles.label} fontSize={15} color='secondaryText'>
              {props.widget.type.split('-').map(w => ['vs', 'and'].includes(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Text>
          </View>}
        {props.widget.minSize !== 'rectangle' &&
          <GestureDetector gesture={resize}>
            <Animated.View style={[styles.dragBarContainer, dragBarStyle]}>
              <Box
                borderColor='containerDragBar'
                backgroundColor='containerDragBar'
                height={props.height.value / 3}
                borderRadius='xl'
                style={styles.dragBar}
              />
            </Animated.View>
          </GestureDetector>}
        <Animated.View style={[styles.deleteButtonContainer, deleteButtonStyle]}>
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
