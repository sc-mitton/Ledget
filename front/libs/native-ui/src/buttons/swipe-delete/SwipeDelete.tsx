import { useRef } from 'react';

import { View, PanResponder, Animated } from 'react-native';
import { ChevronsLeft } from 'geist-native-icons';
import * as Haptics from 'expo-haptics';
import Shimmer from 'react-native-shimmer';

import styles from './styles';
import { Icon } from '../../restyled/Icon';
import { Text } from '../../restyled/Text';
import { Box } from '../../restyled/Box';

/* eslint-disable-next-line */
export interface SwipeDeleteProps {
  onDeleted: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const ESCAPE_VELOCITY = 1.5;

export function SwipeDelete(props: SwipeDeleteProps) {
  const itemDimensions = useRef({ height: 0, width: 0 });
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gs) => false,
    onStartShouldSetPanResponderCapture: (evt, gs) => false,
    onMoveShouldSetPanResponder: (evt, gs) =>
      Math.abs(gs.vx) > Math.abs(gs.vy) && !props.disabled,
    onMoveShouldSetPanResponderCapture: (evt, gs) => false,
    onShouldBlockNativeResponder: () => false,
    onPanResponderMove: (event, { vx, dx }) => {
      if (dx * -1 > itemDimensions.current.width / 2) {
        Haptics.selectionAsync();
        Animated.timing(translateX, {
          toValue: -itemDimensions.current.width * 1.5,
          duration: 200,
          useNativeDriver: false,
        }).start();
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else if (dx <= 0 && !props.disabled) {
        translateX.setValue(dx);
        iconOpacity.setValue(1);
      }
    },
    onPanResponderRelease: (evt, gs) => {
      if (
        Math.abs(gs.dx) < itemDimensions.current.width / 2 &&
        Math.abs(gs.vx) < ESCAPE_VELOCITY
      ) {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        Haptics.selectionAsync();
        Animated.timing(translateX, {
          toValue: -itemDimensions.current.width * 1.5,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          props.onDeleted();
        });
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    },
  });
  return (
    <View {...panResponder.panHandlers}>
      <View
        style={styles.container}
        onLayout={(event) => {
          itemDimensions.current = event.nativeEvent.layout;
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateX }],
            opacity,
          }}
        >
          {props.children}
        </Animated.View>
      </View>
      <Animated.View
        style={[
          styles.trashIconContainer,
          {
            transform: [
              {
                translateX: translateX.interpolate({
                  inputRange: [(-1 * itemDimensions.current.width) / 2, 0],
                  outputRange: [-20, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
            opacity: iconOpacity,
          },
        ]}
      >
        <Box style={styles.trashIcon}>
          <Icon icon={ChevronsLeft} color="alert" size={20} />
          <Shimmer direction="left" opacity={0.6}>
            <Text color="alert">Delete</Text>
          </Shimmer>
        </Box>
      </Animated.View>
    </View>
  );
}
