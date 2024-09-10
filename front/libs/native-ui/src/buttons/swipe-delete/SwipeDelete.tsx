
import { useRef } from 'react';

import { View, PanResponder, Dimensions } from 'react-native';
import Animated, { useSharedValue, withSpring, withTiming, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { ChevronsLeft } from 'geist-native-icons';
import * as Haptics from 'expo-haptics';
import Shimmer from 'react-native-shimmer';

import styles from './styles';
import { Icon } from '../../restyled/Icon';
import { Text } from '../../restyled/Text';
import { defaultSpringConfig } from '../../animated/configs/configs';

/* eslint-disable-next-line */
export interface SwipeDeleteProps {
  onDeleted: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}


export function SwipeDelete(props: SwipeDeleteProps) {
  const itemDimensions = useRef({ height: 0, width: 0 });
  const translateX = useSharedValue(0);
  const iconTranslationX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const iconOpacity = useSharedValue(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gs) => false,
    onStartShouldSetPanResponderCapture: (evt, gs) => false,
    onMoveShouldSetPanResponder: (evt, gs) => Math.abs(gs.vx) > Math.abs(gs.vy),
    onMoveShouldSetPanResponderCapture: (evt, gs) => false,
    onShouldBlockNativeResponder: () => false,
    onPanResponderMove: (event, gs) => {
      if (translateX.value <= 0 && !props.disabled) {
        translateX.value = gs.dx;
        iconOpacity.value = 1;
        iconTranslationX.value = interpolate(translateX.value, [0, itemDimensions.current.width / 2], [0, 20]);
      }
      if (Math.abs(gs.dx) > itemDimensions.current.width / 2 || Math.abs(gs.vx) > 1.5) {
        translateX.value = withTiming(Dimensions.get('window').width * -1, { duration: 300 });
        iconOpacity.value = withTiming(0, { duration: 300 });
        iconTranslationX.value = withTiming(Dimensions.get('window').width * -1, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        !props.disabled && props.onDeleted();
      }
    },
    onPanResponderTerminate: (evt, gs) => {
      if (Math.abs(gs.dx) < itemDimensions.current.width / 2 && Math.abs(gs.vx) < 1.5) {
        translateX.value = withSpring(0, defaultSpringConfig);
        iconOpacity.value = withSpring(0, defaultSpringConfig);
        iconTranslationX.value = withSpring(0, defaultSpringConfig);
      }
    },
    onPanResponderRelease: (evt, gs) => {
      if (Math.abs(gs.dx) < itemDimensions.current.width / 2 && Math.abs(gs.vx) < 1.5) {
        translateX.value = withSpring(0, defaultSpringConfig);
        iconOpacity.value = withSpring(0, defaultSpringConfig);
        iconTranslationX.value = withSpring(0, defaultSpringConfig);
      }
    }
  })

  const animation = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const iconAnimation = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ translateX: iconTranslationX.value }]
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
          <Icon
            icon={ChevronsLeft}
            color='alert'
            size={20}
          />
          <Shimmer
            direction='left'
            opacity={0.6}
          >
            <Text color='alert'>Delete</Text>
          </Shimmer>
        </View >
      </Animated.View>
    </View>
  );
}

export default SwipeDelete;
