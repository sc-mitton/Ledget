import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedRef } from "react-native-reanimated";
import _ from 'underscore';
import { useTheme } from "@shopify/restyle";

import styles from '../styles/widgets-grid';
import { Box } from "@ledget/native-ui";
import { useAppSelector } from "@hooks";
import { selectWidgets, widgetTypes } from "@/features/widgetsSlice";
import { HomeScreenProps } from '@types';
import { getGridPositions } from './helpers';
import { gap } from "./constants";
import Widget from "./Widget";
import TopMask from "./TopMaks";

const WidgetsGrid = (props: HomeScreenProps<'Main'>) => {
  const widgets = useAppSelector(selectWidgets);
  const theme = useTheme();

  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const scrollView = useAnimatedRef<Animated.ScrollView>();
  const widgetsPickerHeight = useSharedValue(0);
  const currentWidgetsHeight = useSharedValue(0);

  const scrollY = useSharedValue(0);
  const positions = useSharedValue(
    Object.fromEntries(_.zip(
      widgets.map(w => w.id || w.type),
      getGridPositions(widgets)).concat(
        _.zip(
          widgetTypes,
          getGridPositions(widgetTypes.map(t => ({ type: t, shape: 'square' })))
        )
      )
    )
  );

  useEffect(() => {
    widgetsPickerHeight.value = Math.ceil(widgetTypes.length / 2) * ((containerWidth / 2) + gap);
  }, [widgetTypes, containerWidth]);

  useEffect(() => {
    positions.value = Object.fromEntries(_.zip(
      widgets.map(w => w.id || w.type),
      getGridPositions(widgets)).concat(
        _.zip(
          widgetTypes,
          getGridPositions(widgetTypes.map(t => ({ type: t, shape: 'square' })))
        )
      )
    )
  }, [widgets]);

  return (
    <>
      <Box style={styles.currentWidgets} variant='nestedScreen'>
        <Box onLayout={(e) => { setContainerWidth(e.nativeEvent.layout.width) }}>
          <Animated.ScrollView
            style={[styles.scrollView]}
            ref={scrollView}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ height: currentWidgetsHeight }} >
              {widgets.map((widget, index) => (
                <Widget
                  key={widget.id as string}
                  widget={widget}
                  index={index}
                  visible={true}
                  height={(containerWidth - gap) / 2}
                  positions={positions}
                  scrollY={scrollY}
                  scrollView={scrollView}
                />
              ))}
            </Animated.View>
          </Animated.ScrollView>
        </Box>
      </Box>
      <Box
        style={[styles.pickerBoxOuter, StyleSheet.absoluteFill]}
        paddingHorizontal="pagePadding"
      >
        <Animated.ScrollView
          style={[
            styles.scrollView,
            { paddingTop: theme.spacing.statusBar + 54 }
          ]}
          contentContainerStyle={{ paddingBottom: theme.spacing.navHeight }}
          ref={scrollView}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ height: widgetsPickerHeight }}>
            {widgetTypes.map(t => ({ type: t, shape: 'square' as const })).map((widget, index) => (
              <Widget
                key={widget.type}
                widget={widget}
                index={index}
                visible={props.route.params?.editMode || activeWidget === widget.type}
                height={(containerWidth - gap) / 2}
                positions={positions}
                scrollY={scrollY}
                scrollView={scrollView}
                onLongPress={(type) => {
                  setActiveWidget(type);
                }}
              />
            ))}
          </Animated.View>
        </Animated.ScrollView>
      </Box>
    </>
  )
}

export default WidgetsGrid;
