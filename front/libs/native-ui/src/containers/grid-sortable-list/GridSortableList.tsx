import { useState } from "react";
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedRef } from "react-native-reanimated";
import { View } from "react-native";
import { useTheme } from "@shopify/restyle";

import type { GridSortableListProps, Positions } from './types';
import Item from './Item';
import styles from './styles/grid-sortable-list';

export const GridSortableList = <T extends object>(props: GridSortableListProps<T>) => {
  const {
    rowPadding = 12,
    columns = 2,
    idField = 'id' as keyof T
  } = props;

  const [itemWidth, setItemWidth] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const scrollView = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const positions = useSharedValue<Positions>(
    Object.assign({}, ...props.data.map((item, index) => ({ [item[idField] as string]: index })))
  );
  const theme = useTheme();

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <>
      {(itemWidth === 0 || itemHeight === 0)
        ?
        <View
          onLayout={(e) => { setItemWidth(Math.floor(e.nativeEvent.layout.width / columns)); }}
          style={styles.measuringItemContainer}>
          <View
            style={styles.measuringItem}
            onLayout={(e) => { setItemHeight(e.nativeEvent.layout.height); }}
          >
            {props.renderItem({ item: props.data[0], index: 0 })}
          </View>
        </View>
        :
        <Animated.ScrollView
          ref={scrollView}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: theme.spacing.navHeight * 1.3 }}
          style={[styles.scrollView, props.containerViewStyle]}
          onLayout={(e) => {
            setItemWidth(Math.floor(e.nativeEvent.layout.width / columns));
            setContainerHeight(e.nativeEvent.layout.height);
          }}
        >
          <View style={styles.ghosts}>
            {props.data.map((item, index) => (
              <View style={{ marginBottom: rowPadding }} key={index}>
                {props.renderItem({ item, index })}
              </View>
            ))}
          </View>
          {props.data.map((item, index) => (
            <Item
              size={{
                width: itemWidth,
                height: itemHeight,
              }}
              key={index}
              id={item[idField] as string}
              positions={positions}
              containerHeight={containerHeight}
              scrollY={scrollY}
              scrollView={scrollView}
              columns={columns}
              rowPadding={rowPadding}
              onDragEnd={props.onDragEnd || (() => { })}
            >
              {props.renderItem({ item, index })}
            </Item>
          ))}
        </Animated.ScrollView>
      }
    </>
  )
}

export default GridSortableList;
