import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedReaction,
  withDelay,
  withTiming
} from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";

import styles from '../styles/widgets-grid';
import { Box } from "@ledget/native-ui";
import { useAppSelector } from "@hooks";
import { selectWidgets, widgetTypes } from "@/features/widgetsSlice";
import { getGridPositions, getPositionsMap } from './helpers';
import { useLoaded } from "@ledget/helpers";
import { gap, bottomLabelPadding } from "./constants";
import { HomeScreenProps } from "@types";
import Widget from "./Widget";

/*
The rendered widgets come from the stored global state. This state only gets updated
after the user has finished dragging the widgets.

During the dragging process, the widgets grid positions and order are updated which
is reflected in the UI. The widget being dragged around isn't affected by any of these changes

*/

const WidgetsBento = (props: HomeScreenProps<'Main'>) => {
  const theme = useTheme()

  const selectedStoredWidgets = useAppSelector(selectWidgets);
  const [widgets, setWidgets] = useState(selectedStoredWidgets)

  // idk why, but I had to use this to make sure the widgets are set, otherwise they
  // weren't animating properly
  const loaded = useLoaded(1000)

  const itemHeight = useSharedValue(0)
  const pickerZIndex = useSharedValue(-1)
  const order = useSharedValue(selectedStoredWidgets.map(w => w.id!))
  const positions = useSharedValue(
    Object.assign(
      getPositionsMap(selectedStoredWidgets),
      getPositionsMap(widgetTypes.map(t => ({ ...t, shape: 'square' })))
    )
  );

  useAnimatedReaction(() => order.value, (newOrder) => {
    const orderedWidgets = newOrder
      .map(key => selectedStoredWidgets.some(w => w.id === key)
        ? selectedStoredWidgets.find(w => w.id === key)
        : {
          ...widgetTypes.find(t => t.type === key)!,
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

  // Make sure the picker is on top when it's active, and behind when it's not
  useEffect(() => {
    if (['picking', 'dropping'].includes(props.route.params.state)) {
      pickerZIndex.value = 100
    } else {
      pickerZIndex.value = withDelay(1500, withTiming(-1, { duration: 0 }))
    }
  }, [props.route.params.state])

  useEffect(() => {
    positions.value = Object.assign(
      getPositionsMap(widgets),
      getPositionsMap(widgetTypes.map(t => ({ ...t, shape: 'square' })))
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
      <Box style={styles.mainBox} variant='nestedScreen' paddingHorizontal="pagePadding">
        <Box
          style={styles.box}
          onLayout={({ nativeEvent: e }) => { itemHeight.value = (e.layout.width - gap) / 2 }}
        >
          <Animated.ScrollView
            style={[styles.scrollView]}
            ref={currentScrollView}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => { currentWidgetsScrollY.value = e.nativeEvent.contentOffset.y }}
            onLayout={(e) => { currentWidgetsContainerHeight.value = e.nativeEvent.layout.height }}
          >
            <View
              style={[
                {
                  height: order.value.length > 0 && positions.value[order.value[order.value.length - 1]] > 0
                    ? Math.ceil(positions.value[order.value[order.value.length - 1]] / 2) * (itemHeight.value + gap) + theme.spacing.navHeight * 2.5
                    : 0
                },
                styles.widgetsContainer,
                styles.currentWidgetsScrollView
              ]}
            >
              {widgets.map((widget, index) => (
                <Widget
                  key={`widget-${widget.id}`}
                  widget={widget}
                  index={index}
                  visible={true}
                  height={itemHeight}
                  positions={positions}
                  order={order}
                  scrollY={currentWidgetsScrollY}
                  scrollView={currentScrollView}
                  scrollHeight={Math.ceil(positions.value[order.value[order.value.length - 1]] / 2) * (itemHeight.value + gap)}
                  containerHeight={currentWidgetsContainerHeight}
                  onDragStart={() => { props.navigation.setParams({ state: 'editing' }) }}
                  loaded={loaded}
                  state={props.route.params.state}
                />
              ))}
            </View>
          </Animated.ScrollView>
        </Box>
      </Box>
      <Animated.View
        style={[StyleSheet.absoluteFill, { zIndex: pickerZIndex }]}
        pointerEvents={props.route.params.state === 'picking' ? 'auto' : 'none'}
      >
        <Box style={[styles.pickerBoxOuter, StyleSheet.absoluteFill]} paddingHorizontal="pagePadding">
          <Animated.ScrollView
            style={[
              styles.scrollView,
              { paddingTop: theme.spacing.statusBar + 54 }
            ]}
            contentContainerStyle={{ paddingBottom: theme.spacing.navHeight + 54, }}
            ref={pickerScrollView}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => { pickerScrollY.value = e.nativeEvent.contentOffset.y }}
            onLayout={(e) => { pickerWidgetsContainerHeight.value = e.nativeEvent.layout.height }}
          >
            <View
              style={[
                {
                  height: positions.value[widgetTypes[widgetTypes.length - 1].type] > 0
                    ? ((Math.ceil(positions.value[widgetTypes[widgetTypes.length - 1].type] - 1000) / 2)) * (itemHeight.value + gap + bottomLabelPadding) + 54
                    : 0
                },
                styles.pickerWidgetsScrollView
              ]}
            >
              {widgetTypes.map((widget, index) => (
                <Widget
                  key={`widget-${widget.type}`}
                  widget={widget}
                  index={index}
                  visible={props.route.params.state === 'picking'}
                  height={itemHeight}
                  positions={positions}
                  order={order}
                  scrollY={pickerScrollY}
                  scrollHeight={((Math.ceil(positions.value[widgetTypes[widgetTypes.length - 1].type] - 1000) / 2)) * (itemHeight.value + gap + bottomLabelPadding) + 54}
                  containerHeight={pickerWidgetsContainerHeight}
                  onDragStart={() => { props.navigation.setParams({ state: 'dropping' }) }}
                  onDragEnd={() => { props.navigation.setParams({ state: 'idle' }) }}
                  scrollView={pickerScrollView}
                  loaded={loaded}
                  state={props.route.params.state}
                />
              ))}
            </View>
          </Animated.ScrollView>
        </Box>
      </Animated.View>
    </>
  )
}

export default WidgetsBento;
