import { useEffect, useState } from 'react';
import { View } from 'react-native';

import styles from './styles/skeleton-transactions';
import { Box } from '@ledget/native-ui';
import Animated, {
  useSharedValue,
  withRepeat,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonTransactionsP {
  height: number;
}

const Skeleton = ({
  setSkeletonHeight,
}: {
  setSkeletonHeight?: (height: number) => void;
}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      Math.random() * 1500,
      withRepeat(withTiming(0.5, { duration: 1000 }), -1, true)
    );
  }, []);

  return (
    <Animated.View
      style={[styles.skeletonContainer, { opacity }]}
      onLayout={(e) =>
        setSkeletonHeight && setSkeletonHeight(e.nativeEvent.layout.height)
      }
    >
      <View style={styles.lc}>
        <Box backgroundColor="transactionShimmer" style={styles.lctr}></Box>
        <Box backgroundColor="transactionShimmer" style={styles.lcbr}></Box>
      </View>
      <View style={styles.rc}>
        <Box backgroundColor="transactionShimmer" style={styles.rctr}></Box>
      </View>
    </Animated.View>
  );
};

const SkeletonTransactions = (props: SkeletonTransactionsP) => {
  const [skeletonHeight, setSkeletonHeight] = useState(0);

  return (
    <View style={styles.skeletonWrapper}>
      <Skeleton setSkeletonHeight={setSkeletonHeight} />
      {skeletonHeight > 0 &&
        Array.from({
          length: Math.floor(props.height / skeletonHeight) - 1,
        }).map((_, i) => <Skeleton key={i} />)}
    </View>
  );
};

export default SkeletonTransactions;
