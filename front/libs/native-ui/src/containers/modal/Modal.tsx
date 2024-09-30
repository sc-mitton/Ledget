import { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Keyboard } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { X } from 'geist-native-icons';
import {
  backgroundColor,
  BackgroundColorProps,
  composeRestyleFunctions,
  useRestyle
} from '@shopify/restyle';

import styles from './styles';
import { Box } from '../../restyled/Box';
import { Icon } from '../../restyled/Icon';
import { Button } from '../../restyled/Button';
import { defaultSpringConfig } from '../../animated/configs/configs';
import { useKeyboardHeight } from '../../hooks/useKeyboardHeight/keyboard-height';
import { Theme } from '../../theme';

type RestyleProps = BackgroundColorProps<Theme>

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([backgroundColor]);

export interface ModalProps extends RestyleProps {
  children: React.ReactNode;
  position?: 'bottom' | 'top' | 'bottomFloat' | 'centerFloat';
  hasExitButton?: boolean
  hasOverlayExit?: boolean
  onClose?: () => void
  hasOverlay?: boolean
}

export function Modal(props: ModalProps) {
  const {
    position = 'bottom',
    hasExitButton = true,
    hasOverlayExit = true,
    hasOverlay = false,
    children,
    onClose,
    ...rest
  } = props;

  const restyleProps = useRestyle(restyleFunctions, rest);

  const navigation = useNavigation();
  const keyboardHeight = useKeyboardHeight()

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const keyboardPaddingY = useSharedValue(position.includes('bottom') ? 64 : 0);

  const avoidKeyboardAnimation = useAnimatedStyle(() => {
    return {
      paddingBottom: withSpring(keyboardPaddingY.value, defaultSpringConfig)
    }
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Translate the modal content up when the keyboard is visible
  useEffect(() => {
    if (position === 'top') return

    if (isKeyboardVisible) {
      keyboardPaddingY.value = withSpring(keyboardHeight, defaultSpringConfig)
    } else {
      keyboardPaddingY.value = withSpring(position === 'bottom' ? 64 : 24, defaultSpringConfig)
    }
  }, [isKeyboardVisible]);

  return (
    <>
      <Pressable
        onPress={() => hasOverlayExit && onClose ? onClose() : navigation.goBack()}
        style={StyleSheet.absoluteFillObject}
      />
      {hasOverlay &&
        <Pressable
          onPress={() => hasOverlayExit && onClose ? onClose() : navigation.goBack()}
          style={StyleSheet.absoluteFillObject}
        >
          <Box
            backgroundColor='modalOverlay'
            style={styles.overlay}
          />
        </Pressable>}
      <View style={[styles[`${position}ModalContainer`]]}>
        <Box
          style={[styles[`${position}Modal`], (restyleProps as any).style[0]]}
          borderColor='modalBorder'
          borderWidth={1}
          backgroundColor={'modalBox'}
          {...(hasOverlay ? {
            shadowColor: 'modalShadow',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 12,
          } : {})}
        >
          {hasExitButton && <View style={styles.closeButton}>
            <Button onPress={() => onClose ? onClose() : navigation.goBack()} variant='circleButton' >
              <Icon icon={X} size={20} color='secondaryText' />
            </Button>
          </View>}
          <Animated.View style={[avoidKeyboardAnimation]}>
            {children}
          </Animated.View>
        </Box>
      </View>
    </>
  );
}


export default Modal;
