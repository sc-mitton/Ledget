
import { useRef } from 'react';

import { View, PanResponder, Dimensions } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { ArrowLeft } from 'geist-native-icons';
import * as Haptics from 'expo-haptics';

import styles from './styles';
import { Text } from '../../restyled/Text';
import { Icon } from '../../restyled/Icon';
import { defaultSpringConfig } from '../../animated/configs/configs';

/* eslint-disable-next-line */
export interface SwipeDeleteProps {
  onDeleted: () => void;
  children: React.ReactNode;
}


export function SwipeDelete(props: SwipeDeleteProps) {
  const itemDimensions = useRef({ height: 0, width: 0 });
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gs) => false,
    onStartShouldSetPanResponderCapture: (evt, gs) => false,
    onMoveShouldSetPanResponder: (evt, gs) => Math.abs(gs.vx) > Math.abs(gs.vy),
    onMoveShouldSetPanResponderCapture: (evt, gs) => false,
    onShouldBlockNativeResponder: () => false,
    onPanResponderMove: (event, gs) => {
      if (translateX.value <= 0) {
        translateX.value = gs.dx;
      }
      if (Math.abs(gs.dx) > itemDimensions.current.width / 2 || Math.abs(gs.vx) > 1.5) {
        translateX.value = withSpring(Dimensions.get('window').width * -1, defaultSpringConfig);
        opacity.value = 0;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        props.onDeleted();
      }
    },
    onPanResponderTerminate: (evt, gs) => {
      if (Math.abs(gs.dx) < itemDimensions.current.width / 2 && Math.abs(gs.vx) < 1.5) {
        translateX.value = withSpring(0, defaultSpringConfig);
      }
    },
    onPanResponderRelease: (evt, gs) => {
      if (Math.abs(gs.dx) < itemDimensions.current.width / 2 && Math.abs(gs.vx) < 1.5) {
        translateX.value = withSpring(0, defaultSpringConfig);
      }
    }
  })

  const animation = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const iconAnimation = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View {...panResponder.panHandlers}>
      <View
        style={styles.container}
        onLayout={(event) => { itemDimensions.current = event.nativeEvent.layout }}
      >
        <Animated.View style={animation}>
          {props.children}
        </Animated.View>
      </View>
      <Animated.View style={[styles.trashIconContainer, iconAnimation]}>
        <View style={styles.trashIcon}>
          <Icon icon={ArrowLeft} color='alert' size={18} />
          <Text color='alert' fontSize={14}>Delete</Text>
        </View >
      </Animated.View>
    </View>
  );
}


export default SwipeDelete;
