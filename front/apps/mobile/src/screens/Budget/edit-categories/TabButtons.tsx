import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

import styles from './styles/tab-buttons';
import { Box, Text, defaultSpringConfig } from '@ledget/native-ui';

interface Props {
  index: number;
  setIndex: (index: number) => void;
}

const TabButtons = (props: Props) => {
  const { index: pageIndex, setIndex: setPageIndex } = props;
  const left = useSharedValue(0);
  const tabButtonsWidth = useRef(0);

  useEffect(() => {
    props.setIndex(pageIndex);
    left.value = withSpring(
      (pageIndex * tabButtonsWidth.current) / 2,
      defaultSpringConfig
    );
  }, [pageIndex]);

  return (
    <View style={styles.container}>
      <Box
        style={styles.tabButtonsBox}
        backgroundColor="tabsTrack"
        padding="xs"
        borderRadius="m"
      >
        <View
          style={styles.tabButtons}
          onLayout={(e) =>
            (tabButtonsWidth.current = e.nativeEvent.layout.width)
          }
        >
          <View style={styles.tabButton}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPageIndex(0)}
            >
              <Text color={pageIndex === 0 ? 'mainText' : 'tertiaryText'}>
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabButton}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPageIndex(1)}
            >
              <Text color={pageIndex === 1 ? 'mainText' : 'tertiaryText'}>
                Yearly
              </Text>
            </TouchableOpacity>
          </View>
          <Animated.View style={[{ left: left }, styles.animatedTabBack]}>
            <Box
              backgroundColor="tabsBackground"
              borderRadius="s"
              style={styles.tabBack}
            />
          </Animated.View>
        </View>
      </Box>
    </View>
  );
};
export default TabButtons;
