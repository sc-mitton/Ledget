import { useCallback, useEffect } from 'react';
import { Check, AlertCircle, Info } from 'geist-native-icons';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Animated, {
  runOnJS,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SlideInUp,
  SlideOutUp
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

import styles from './styles/item';
import { ToastItem as TToastItem, tossToast } from "@ledget/shared-features";
import { Box } from "../../restyled/Box";
import { Icon } from "../../restyled/Icon";
import { Text } from '../../restyled/Text';
import { Button } from '../../restyled/Button';

export const ToastItem = (props: TToastItem & { index: number }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const y = useSharedValue(-100);

  const onEnd = useCallback(() => {
    dispatch(tossToast(props.id))
  }, []);

  const pan = Gesture.Pan()
    .onChange(({ changeY }) => {
      y.value += changeY;
    })
    .onEnd(() => {
      runOnJS(onEnd)();
    });

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y.value }],
      zIndex: props.index
    };
  });

  useEffect(() => {
    y.value = withTiming(props.index * 16 + 40);
  })

  return (
    <Animated.View
      style={[styles.toastItemContainer, style]}
      entering={SlideInUp.duration(600).easing(Easing.bezier(.17, .67, .47, .99).factory())}
      exiting={SlideOutUp.duration(600)}
    >
      <GestureDetector gesture={pan}>
        <Box
          backgroundColor="toast"
          style={styles.toastItem}
          borderColor='toastBorder'
          borderWidth={1}
          shadowColor='menuShadowColor'
          shadowOpacity={1}
          shadowRadius={20}
          elevation={15}
        >
          <View style={styles.iconContainer}>
            {props.type === 'info' && <Icon icon={Info} color='mainText' />}
            {props.type === 'success' && <Icon icon={Check} color='successIcon' />}
            {props.type === 'error' && <Icon icon={AlertCircle} color="alert" />}
          </View>
          <View style={styles.messageContainer}><Text>{props.message}</Text></View>
          {props.actionLink &&
            <Button
              textColor='secondaryText'
              fontSize={15}
              label={props.actionMessage}
              onPress={() => {
                const args = Array.isArray(props.actionLink) ? props.actionLink : [props.actionLink];
                navigation.navigate(...args);
                dispatch(tossToast(props.id));
              }} />}
        </Box>
      </GestureDetector>
    </Animated.View>
  )
}

export default ToastItem
