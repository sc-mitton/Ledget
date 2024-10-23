import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useSharedValue, useAnimatedRef, useAnimatedReaction } from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";

import styles from '../styles/widgets-grid';
import { Box } from "@ledget/native-ui";
import { useAppSelector } from "@hooks";
import { selectWidgets, widgetTypes, removeWidget } from "@/features/widgetsSlice";
import { WidgetsGridProps } from './types';
import { getGridPositions, getPositionsMap } from './helpers';
import { gap } from "./constants";
import { useAppDispatch } from "@hooks";
import Widget from "./Widget";

/*
The rendered widgets come from the stored global state. This state only gets updated
after the user has finished dragging the widgets.

During the dragging process, the widgets grid positions and order are updated which
is reflected in the UI. The widget being dragged around isn't affected by any of these changes

*/

const WidgetsGrid = (props: WidgetsGridProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme()

  const selectedStoredWidgets = useAppSelector(selectWidgets);
  const [widgets, setWidgets] = useState(selectedStoredWidgets)

  const itemHeight = useSharedValue(0)
  const order = useSharedValue(selectedStoredWidgets.map(w => w.id!))
  const positions = useSharedValue(
    Object.assign(
      getPositionsMap(selectedStoredWidgets),
      getPositionsMap(widgetTypes.map(t => ({ type: t, shape: 'square' as const }))),
    )
  );

  // useEffect(() => {
  //   dispatch(removeWidget(widgets[0]))
  // }, [])

  useAnimatedReaction(() => order.value, (newOrder) => {
    const orderedWidgets = newOrder
      .map(key => selectedStoredWidgets.some(w => w.id === key)
        ? selectedStoredWidgets.find(w => w.id === key)
        : {
          type: widgetTypes.find(t => t === key)!,
          shape: 'square' as const,
          id: undefined
        }
      ).filter(w => w !== undefined)

    const newGridPositions = getGridPositions(orderedWidgets)
    const updatedPositionEntries = orderedWidgets.map((w, index) =>
      [w.id || w.type, newGridPositions[index]] as [string, number])
    const updatedPositionsMap = Object.fromEntries(updatedPositionEntries)
    Object.assign(positions.value, updatedPositionsMap)
  })

  // Update the grid positions and order
  useEffect(() => {
    setWidgets(selectedStoredWidgets)
  }, [selectedStoredWidgets])

  useEffect(() => {
    positions.value = Object.assign(
      getPositionsMap(widgets),
      getPositionsMap(widgetTypes.map(t => ({ type: t, shape: 'square' as const }))),
    )
    order.value = widgets.map(w => w.id!)
  }, [widgets])

  const pickerScrollView = useAnimatedRef<Animated.ScrollView>();
  const pickerWidgetsContainerHeight = useSharedValue(0);
  const pickerScrollY = useSharedValue(0);

  const currentScrollView = useAnimatedRef<Animated.ScrollView>();
  const currentWidgetsContainerHeight = useSharedValue(0);
  const currentWidgetsScrollY = useSharedValue(0);

  return (
    <>
      <Box style={styles.currentWidgets} variant='nestedScreen' paddingHorizontal="pageExtraPadding">
        <Box
          style={styles.currentWidgets}
          onLayout={({ nativeEvent: e }) => {
            itemHeight.value = (e.layout.width - gap) / 2
          }}
        >
          <Animated.ScrollView
            style={[styles.scrollView]}
            ref={currentScrollView}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onLayout={(e) => { currentWidgetsContainerHeight.value = e.nativeEvent.layout.height }}
          >
            <View
              style={[
                { height: Math.ceil(widgets.length / 2) * (itemHeight.value + gap) },
                styles.widgetsContainer,
                styles.currentWidgetsScrollView
              ]}
            >
              {widgets.map((widget, index) => (
                <Widget
                  key={widget.id as string}
                  widget={widget}
                  index={index}
                  visible={true}
                  height={itemHeight}
                  positions={positions}
                  order={order}
                  scrollY={currentWidgetsScrollY}
                  scrollView={currentScrollView}
                  scrollHeight={Math.ceil(widgets.length / 2) * (itemHeight.value + gap)}
                  containerHeight={currentWidgetsContainerHeight}
                />
              ))}
            </View>
          </Animated.ScrollView>
        </Box>
      </Box>
      <Box style={[styles.pickerBoxOuter, StyleSheet.absoluteFill]} paddingHorizontal="pageExtraPadding">
        <Animated.ScrollView
          style={[
            styles.scrollView,
            { paddingTop: theme.spacing.statusBar + 54 }
          ]}
          contentContainerStyle={{ paddingBottom: theme.spacing.navHeight + 54, }}
          ref={pickerScrollView}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onLayout={(e) => { pickerWidgetsContainerHeight.value = e.nativeEvent.layout.height }}
        >
          <View
            style={[
              { height: Math.ceil(widgetTypes.length / 2) * (itemHeight.value + gap) },
              styles.pickerWidgetsScrollView
            ]}
          >
            {widgetTypes.map(t => ({ type: t, shape: 'square' as const })).map((widget, index) => (
              <Widget
                key={widget.type}
                widget={widget}
                index={index}
                visible={props.pickerMode}
                height={itemHeight}
                positions={positions}
                order={order}
                scrollY={pickerScrollY}
                scrollHeight={Math.ceil(widgetTypes.length / 2) * itemHeight.value}
                containerHeight={pickerWidgetsContainerHeight}
                scrollView={pickerScrollView}
                onDragStart={() => { props.setPickerMode(false) }}
              />
            ))}
          </View>
        </Animated.ScrollView>
      </Box>
    </>
  )
}

export default WidgetsGrid;
