import { useState, useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import PagerView from 'react-native-pager-view';

import styles from './styles/aggregates-carousel';
import { Box } from '@ledget/native-ui';
import Summary from './Summary';
import Graph from './Graph';
import { useLoaded } from '@ledget/helpers';
import { AccountsTabsScreenProps } from '@types';

const DOT_WIDTH = 6;
const DOT_GAP = DOT_WIDTH;

const AggregatesCarousel = (props: AccountsTabsScreenProps<'Depository'>) => {
  const loaded = useLoaded(1000);
  const [page, setPage] = useState(0);
  const o1 = useRef(new Animated.Value(0)).current;
  const o2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(o1, {
        toValue: page === 0 ? .95 : .3,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(o2, {
        toValue: page === 1 ? .95 : .3,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [page]);

  return (
    <Box
      style={styles.nestedContainer}
      marginHorizontal='l'
      variant='blueNestedContainer'
    >
      <View style={[styles.carouselIndicators, { gap: DOT_GAP }]}>
        <Animated.View style={{ opacity: o1 }} >
          <Box
            backgroundColor='mainText'
            width={DOT_WIDTH}
            height={DOT_WIDTH}
            borderRadius={DOT_WIDTH / 2}
          />
        </Animated.View>
        <Animated.View style={{ opacity: o2 }} >
          <Box
            backgroundColor='mainText'
            width={DOT_WIDTH}
            height={DOT_WIDTH}
            borderRadius={DOT_WIDTH / 2}
          />
        </Animated.View>
      </View>
      <PagerView
        style={styles.pagerView}
        onPageSelected={({ nativeEvent }) => setPage(nativeEvent.position)}
        initialPage={page}
      >
        <Summary {...props} />
        <Graph />
      </PagerView>
    </Box>
  );
};

export default AggregatesCarousel;
