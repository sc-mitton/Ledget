import { useState } from "react";
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedRef } from "react-native-reanimated";
import { View } from "react-native";

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
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const scrollView = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const positions = useSharedValue<Positions>(
    Object.assign({}, ...props.data.map((item, index) => ({ [item[idField] as string]: index })))
  );

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <>
      {(itemWidth === 0 || itemHeight === 0)
        ?
        <View style={styles.measuringItemContainer}>
          <View
            style={styles.measuringItem}
            onLayout={(e) => {
              setItemWidth(e.nativeEvent.layout.width);
              setItemHeight(e.nativeEvent.layout.height);
            }}
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
          style={[styles.scrollView, props.containerViewStyle]}
          onLayout={(e) => {
            setContainerSize(e.nativeEvent.layout);
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
              containerSize={containerSize}
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
