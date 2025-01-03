import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedReaction,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';

import styles from '../styles/widgets-grid';
import { Box } from '@ledget/native-ui';
import { useAppDispatch, useAppSelector } from '@hooks';
import {
  selectWidgets,
  widgetTypes,
  moveWidgets,
} from '@/features/widgetsSlice';
import { getGridPositions, getPositionsMap } from './helpers';
import { gap, bottomLabelPadding } from './constants';
import { WidgetsBentoProps } from './types';
import Widget from './Widget';

/*
The rendered widgets come from the stored global state. This state only gets updated
after the user has finished dragging the widgets.

During the dragging process, the widgets grid positions and order are updated which
is reflected in the UI. The widget being dragged around isn't affected by any of these changes

*/

const WidgetsBento = (props: WidgetsBentoProps) => {
  const theme = useTheme();

  const dispatch = useAppDispatch();
  const selectedStoredWidgets = useAppSelector(selectWidgets);

  const [widgets, setWidgets] = useState(selectedStoredWidgets);
  const [pickerHeight, setPickerHeight] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);

  const itemHeight = useSharedValue(0);
  const pickerZIndex = useSharedValue(-1);
  const order = useSharedValue(selectedStoredWidgets.map((w) => w.id!));
  const positions = useSharedValue(
    Object.assign(
      getPositionsMap(selectedStoredWidgets),
      getPositionsMap(widgetTypes.map((t) => ({ ...t, shape: 'square' })))
    )
  );

  const pickerScrollView = useAnimatedRef<Animated.ScrollView>();
  const pickerWidgetsContainerHeight = useSharedValue(0);
  const pickerScrollY = useSharedValue(0);

  const currentScrollView = useAnimatedRef<Animated.ScrollView>();
  const currentWidgetsContainerHeight = useSharedValue(0);
  const currentWidgetsScrollY = useSharedValue(0);

  useAnimatedReaction(
    () => order.value,
    (newOrder) => {
      const orderedWidgets = newOrder
        .map((key) =>
          selectedStoredWidgets.some((w) => w.id === key)
            ? selectedStoredWidgets.find((w) => w.id === key)
            : {
                ...widgetTypes.find((t) => t.type === key)!,
                id: undefined,
              }
        )
        .filter((w) => w !== undefined);

      const newGridPositions = getGridPositions(orderedWidgets);
      const updatedPositionEntries = orderedWidgets.map((w, index) => [
        w.id || w.type,
        newGridPositions[index],
      ]);
      const updatedPositionsMap = Object.fromEntries(updatedPositionEntries);
      Object.assign(positions.value, updatedPositionsMap);
    }
  );

  useAnimatedReaction(
    () => itemHeight.value,
    (newHeight) => {
      runOnJS(setPickerHeight)(
        positions.value[widgetTypes[widgetTypes.length - 1].type]?.[0] > 0
          ? (Math.ceil(
              positions.value[widgetTypes[widgetTypes.length - 1].type][0] -
                1000
            ) /
              2) *
              (newHeight + gap + bottomLabelPadding) +
              54
          : 0
      );
      runOnJS(setCurrentHeight)(
        positions.value[order.value[order.value.length - 1]]?.[0]
          ? Math.ceil(
              (positions.value[order.value[order.value.length - 1]]?.[0] + 1) /
                2
            ) *
              (newHeight + gap) +
              theme.spacing.navHeight -
              gap
          : 0
      );
    }
  );

  // Update the grid positions and order
  useEffect(() => {
    setWidgets(selectedStoredWidgets);
  }, [selectedStoredWidgets]);

  // Make sure the picker is on top when it's active, and behind when it's not
  useEffect(() => {
    if (['picking', 'dropping'].includes(props.route.params?.state)) {
      pickerZIndex.value = 100;
    } else {
      pickerZIndex.value = withDelay(1500, withTiming(-1, { duration: 0 }));
    }
    if (!['picking', 'dropping'].includes(props.route.params?.state)) {
      pickerScrollView.current?.scrollTo({ y: 0, animated: false });
    }
  }, [props.route.params?.state]);

  useEffect(() => {
    positions.value = Object.assign(
      getPositionsMap(widgets),
      getPositionsMap(widgetTypes.map((t) => ({ ...t, shape: 'square' })))
    );
    order.value = widgets.map((w) => w.id!);
  }, [widgets]);

  const onDragEnd = useCallback(() => {
    const moves = [] as { widget: string; index: number }[];
    order.value.forEach((id, index) => {
      if (id !== widgets[index].id) {
        moves.push({ widget: id, index });
      }
    });
    dispatch(moveWidgets(moves));
  }, [order.value]);

  return (
    <>
      <Box
        style={styles.mainBox}
        variant="nestedScreen"
        paddingHorizontal="pagePadding"
      >
        <Box
          style={styles.box}
          onLayout={({ nativeEvent: e }) => {
            itemHeight.value = (e.layout.width - gap) / 2;
          }}
        >
          <Animated.ScrollView
            style={[styles.scrollView]}
            ref={currentScrollView}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => {
              currentWidgetsScrollY.value = e.nativeEvent.contentOffset.y;
            }}
            onLayout={(e) => {
              currentWidgetsContainerHeight.value = e.nativeEvent.layout.height;
            }}
          >
            <View
              style={[
                { height: currentHeight },
                styles.widgetsContainer,
                styles.currentWidgetsScrollView,
              ]}
            >
              {widgets.map((widget, index) => (
                <Widget
                  key={`widget-${widget.id}`}
                  widget={widget}
                  index={index}
                  height={itemHeight}
                  positions={positions}
                  order={order}
                  scrollY={currentWidgetsScrollY}
                  scrollView={currentScrollView}
                  scrollHeight={
                    order.value.length > 0 &&
                    positions.value[order.value[order.value.length - 1]][0] > 0
                      ? Math.ceil(
                          positions.value[
                            order.value[order.value.length - 1]
                          ][0] / 2
                        ) *
                          (itemHeight.value + gap) +
                        theme.spacing.navHeight * 2.5
                      : 0
                  }
                  containerHeight={currentWidgetsContainerHeight}
                  onDragEnd={onDragEnd}
                  state={props.route.params?.state}
                />
              ))}
            </View>
          </Animated.ScrollView>
        </Box>
      </Box>
      <Animated.View
        style={[StyleSheet.absoluteFill, { zIndex: pickerZIndex }]}
        pointerEvents={
          props.route.params?.state === 'picking' ? 'auto' : 'none'
        }
      >
        <Box
          style={[styles.pickerBoxOuter, StyleSheet.absoluteFill]}
          paddingHorizontal="pagePadding"
        >
          <Animated.ScrollView
            style={[
              styles.scrollView,
              { paddingTop: theme.spacing.statusBar + 54 },
            ]}
            contentContainerStyle={{
              paddingBottom: theme.spacing.navHeight + 54,
            }}
            ref={pickerScrollView}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => {
              pickerScrollY.value = e.nativeEvent.contentOffset.y;
            }}
            onLayout={(e) => {
              pickerWidgetsContainerHeight.value = e.nativeEvent.layout.height;
            }}
          >
            <View
              style={[{ height: pickerHeight }, styles.pickerWidgetsScrollView]}
            >
              {widgetTypes.map((widget, index) => (
                <Widget
                  key={`widget-${widget.type}`}
                  widget={widget}
                  index={index}
                  height={itemHeight}
                  positions={positions}
                  order={order}
                  scrollY={pickerScrollY}
                  scrollHeight={
                    positions.value[
                      widgetTypes[widgetTypes.length - 1].type
                    ]?.[0] > 0
                      ? (Math.ceil(
                          positions.value[
                            widgetTypes[widgetTypes.length - 1].type
                          ][0] - 1000
                        ) /
                          2) *
                          (itemHeight.value + gap + bottomLabelPadding) +
                        54
                      : 0
                  }
                  containerHeight={pickerWidgetsContainerHeight}
                  onDragStart={() => {
                    props.navigation.setParams({ state: 'dropping' });
                  }}
                  onDragEnd={() => {
                    props.navigation.setParams({ state: 'idle' });
                  }}
                  scrollView={pickerScrollView}
                  state={props.route.params?.state}
                />
              ))}
            </View>
          </Animated.ScrollView>
        </Box>
      </Animated.View>
    </>
  );
};

export default WidgetsBento;
