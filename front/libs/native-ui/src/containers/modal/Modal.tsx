import { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Keyboard } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  SlideInUp,
  SlideInDown,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { X } from 'geist-native-icons';
import {
  backgroundColor,
  BackgroundColorProps,
  composeRestyleFunctions,
  useRestyle,
} from '@shopify/restyle';
import { BlurView } from 'expo-blur';
import { useTheme } from '@shopify/restyle';

import styles from './styles';
import { Box } from '../../restyled/Box';
import { Icon } from '../../restyled/Icon';
import { Button } from '../../restyled/Button';
import { defaultSpringConfig } from '../../animated/configs/configs';
import { useKeyboardHeight } from '../../hooks/useKeyboardHeight/keyboard-height';
import { Theme } from '../../theme';

type RestyleProps = BackgroundColorProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  backgroundColor,
]);

export interface ModalProps extends RestyleProps {
  children: React.ReactNode;
  position?: 'bottom' | 'top' | 'bottomFloat' | 'centerFloat';
  animation?: 'slideUp' | 'slideDown';
  hasExitButton?: boolean;
  hasOverlayExit?: boolean;
  onClose?: () => void;
  hasOverlay?: boolean;
  blurbackground?: boolean;
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

  const theme = useTheme<Theme>();
  const navigation = useNavigation();
  const keyboardHeight = useKeyboardHeight();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const keyboardPaddingY = useSharedValue(0);

  const avoidKeyboardAnimation = useAnimatedStyle(() => {
    return { paddingBottom: keyboardPaddingY.value };
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
    if (position === 'top') return;

    if (isKeyboardVisible) {
      keyboardPaddingY.value = withSpring(keyboardHeight, defaultSpringConfig);
    } else {
      keyboardPaddingY.value = withSpring(0, defaultSpringConfig);
    }
  }, [isKeyboardVisible]);

  return (
    <>
      <Pressable
        onPress={() =>
          hasOverlayExit && onClose ? onClose() : navigation.goBack()
        }
        style={[StyleSheet.absoluteFillObject]}
      />
      <BlurView
        intensity={7}
        tint={theme.colors.mode === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFillObject}
      >
        {hasOverlay && (
          <Pressable
            onPress={() =>
              hasOverlayExit && onClose ? onClose() : navigation.goBack()
            }
            style={StyleSheet.absoluteFillObject}
          >
            <Box backgroundColor="modalOverlay" style={styles.overlay} />
          </Pressable>
        )}
        <Animated.View
          style={[styles[`${position}ModalContainer`]]}
          entering={
            props.animation === 'slideDown'
              ? SlideInUp.springify()
                  .damping(35)
                  .stiffness(315)
                  .mass(1)
                  .overshootClamping(0)
              : props.animation === 'slideUp'
              ? SlideInDown.springify()
                  .damping(35)
                  .stiffness(315)
                  .mass(1)
                  .overshootClamping(0)
              : undefined
          }
        >
          <Box
            style={[styles[`${position}Modal`], (restyleProps as any).style[0]]}
            backgroundColor={'modalBox'}
            {...(hasOverlay
              ? {
                  shadowColor: 'modalShadow',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 12,
                }
              : {})}
          >
            {hasExitButton && (
              <View style={styles.closeButton}>
                <Button
                  onPress={() => (onClose ? onClose() : navigation.goBack())}
                  variant="circleButton"
                  icon={
                    <Icon
                      icon={X}
                      size={20}
                      color="secondaryText"
                      strokeWidth={1.75}
                    />
                  }
                />
              </View>
            )}
            <Animated.View style={[avoidKeyboardAnimation]}>
              {children}
            </Animated.View>
          </Box>
        </Animated.View>
      </BlurView>
    </>
  );
}

export default Modal;
