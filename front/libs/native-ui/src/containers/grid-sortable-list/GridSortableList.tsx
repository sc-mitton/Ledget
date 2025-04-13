import { useState } from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedRef,
} from 'react-native-reanimated';
import { View } from 'react-native';

import type { GridSortableListProps, Positions } from './types';
import Item from './Item';
import styles from './styles/grid-sortable-list';

export const GridSortableList = <T extends object>(
  props: GridSortableListProps<T>
) => {
  const { rowPadding = 12, columns = 2, idField = 'id' as keyof T } = props;

  const [scrollContentHeight, setScrollContentHeight] = useState(0);

  const itemSize = useSharedValue({ width: 0, height: 0 });
  const scrollView = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const positions = useSharedValue<Positions>(
    Object.assign(
      {},
      ...props.data.map((item, index) => ({ [item[idField] as string]: index }))
    )
  );

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <>
      <View style={styles.measuringItemContainer}>
        <View
          style={styles.measuringItem}
          onLayout={({ nativeEvent: e }) => {
            setScrollContentHeight(
              Math.ceil(props.data.length / columns) *
                (e.layout.height + rowPadding)
            );

            itemSize.value = { width: e.layout.width, height: e.layout.height };
          }}
        >
          {props.renderItem({ item: props.data[0], index: 0 })}
        </View>
      </View>
      <Animated.ScrollView
        ref={scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={[styles.scrollView, props.containerViewStyle]}
      >
        <View style={{ height: scrollContentHeight }}>
          {props.data.map((item, index) => (
            <Item
              key={index}
              size={itemSize}
              scrollHeight={scrollContentHeight}
              id={item[idField] as string}
              positions={positions}
              scrollY={scrollY}
              scrollView={scrollView}
              columns={columns}
              rowPadding={rowPadding}
              onDragEnd={props.onDragEnd || (() => {})}
            >
              {props.renderItem({ item, index })}
            </Item>
          ))}
        </View>
      </Animated.ScrollView>
    </>
  );
};

export default GridSortableList;
