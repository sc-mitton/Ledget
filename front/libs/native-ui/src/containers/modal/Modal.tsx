import { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Keyboard } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { X } from 'geist-native-icons';

import styles from './styles';
import { Box } from '../../restyled/Box';
import { Icon } from '../../restyled/Icon';
import { Button } from '../../restyled/Button';
import { defaultSpringConfig } from '../../animated/configs/configs';
import { useKeyboardHeight } from '../../hooks/useKeyboardHeight/keyboard-height';

/* eslint-disable-next-line */
export interface ModalProps {
  children: React.ReactNode;
  position?: 'bottom' | 'top' | 'float',
  hasExitButton?: boolean
  hasOverlayExit?: boolean
}


export function Modal(props: ModalProps) {
  const {
    position = 'bottom',
    hasExitButton = true,
    hasOverlayExit = true
  } = props;
  const navigation = useNavigation();
  const keyboardHeight = useKeyboardHeight()

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const keyboardPaddingY = useSharedValue(position === 'bottom' ? 64 : 24);

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
        onPress={() => hasOverlayExit && navigation.goBack()}
        style={StyleSheet.absoluteFillObject}
      />
      <Box
        style={[styles[`${position}Modal`]]}
        backgroundColor='modalBox'
        shadowColor='navShadow'
        shadowOpacity={0.5}
        shadowRadius={10}
        shadowOffset={{ width: 0, height: -4 }}
      >
        {hasExitButton && <View style={styles.closeButton}>
          <Button onPress={() => navigation.goBack()} variant='circleButton' >
            <Icon icon={X} size={20} color='secondaryText' />
          </Button>
        </View>}
        <Animated.View style={[avoidKeyboardAnimation]}>
          {props.children}
        </Animated.View>
      </Box>
    </>
  );
}


export default Modal;
