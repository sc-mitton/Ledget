import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import styles from './styles';
import { Box } from '@ledget/native-ui';

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
      style={[styles.bonesContainer, { opacity }]}
      onLayout={(e) =>
        setSkeletonHeight && setSkeletonHeight(e.nativeEvent.layout.height)
      }
    >
      <Box backgroundColor="pulseBox" style={styles.leftBone}></Box>
      <Box backgroundColor="pulseBox" style={styles.rightBone}></Box>
    </Animated.View>
  );
};

const SkeletonList = ({ length = 5 }: { length?: number }) => {
  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </View>
  );
};

export default SkeletonList;
