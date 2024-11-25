import { View } from 'react-native';
import Animated, { useSharedValue, withSpring, withTiming, useAnimatedStyle, interpolate, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ChevronsLeft } from 'geist-native-icons';
import * as Haptics from 'expo-haptics';
import Shimmer from 'react-native-shimmer';

import styles from './styles';
import { Icon } from '../../restyled/Icon';
import { Text } from '../../restyled/Text';
import { Box } from '../../restyled/Box';
import { defaultSpringConfig } from '../../animated/configs/configs';

/* eslint-disable-next-line */
export interface SwipeDeleteProps {
  onDeleted: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const ESCAPE_VELOCITY = 1500;

export function SwipeDelete(props: SwipeDeleteProps) {
  const itemDimensions = useSharedValue({ height: 0, width: 0 });
  const translateX = useSharedValue(0);
  const iconTranslationX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const iconOpacity = useSharedValue(0);

  const pan = Gesture.Pan()
    .failOffsetY([0, 0])
    .onChange((e) => {
      if (Math.abs(e.translationX) > itemDimensions.value.width / 2 || Math.abs(e.velocityX) > ESCAPE_VELOCITY) {
        translateX.value = withTiming(-itemDimensions.value.width, defaultSpringConfig, () => {
          runOnJS(props.onDeleted)();
          runOnJS(Haptics.selectionAsync)();
        });
        iconOpacity.value = withTiming(0, defaultSpringConfig);
        iconTranslationX.value = withTiming(0, defaultSpringConfig);
      } else if (e.translationX <= 0 && !props.disabled) {
        translateX.value = e.translationX;
        iconOpacity.value = 1;
        iconTranslationX.value = interpolate(translateX.value, [0, itemDimensions.value.width / 2], [0, 20]);
      }
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) < itemDimensions.value.width / 2 && Math.abs(e.velocityX) < ESCAPE_VELOCITY) {
        translateX.value = withSpring(0, defaultSpringConfig);
        iconOpacity.value = withSpring(0, defaultSpringConfig);
        iconTranslationX.value = withSpring(0, defaultSpringConfig);
      }
    });

  const animation = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const iconAnimation = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ translateX: iconTranslationX.value }]
  }));

  return (
    <View>
      <GestureDetector gesture={pan}>
        <Animated.View style={animation}>
          <View
            style={[styles.container]}
            onLayout={(event) => { itemDimensions.value = event.nativeEvent.layout }}
          >
            {props.children}
          </View>
        </Animated.View>
      </GestureDetector>
      <Animated.View style={[styles.trashIconContainer, iconAnimation]}>
        <Box style={styles.trashIcon}>
          <Icon icon={ChevronsLeft} color='alert' size={20}
          />
          <Shimmer direction='left' opacity={0.6}>
            <Text color='alert'>Delete</Text>
          </Shimmer>
        </Box >
      </Animated.View>
    </View>
  );
}

export default SwipeDelete;
