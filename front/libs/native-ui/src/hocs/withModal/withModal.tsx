import { FC, useState, useEffect } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated'
import { View, Keyboard } from 'react-native'
import { X } from 'geist-native-icons';
import OutsidePressHandler from 'react-native-outside-press';

import styles from './styles';
import { Box } from '../../restyled/Box';
import { Icon } from '../../restyled/Icon';
import { Button } from '../../restyled/Button';
import { defaultSpringConfig } from '../../animated/configs/configs';
import { useKeyboardHeight } from '../../hooks/useKeyboardHeight/keyboard-height';

type Placement = 'top' | 'bottom' | 'float'

type Props = {
  onClose?: () => void,
  hasExit?: boolean,
  placement?: Placement
}

export function withModal<P>(WrappedComponent: FC<P & { closeModal: () => void }>) {
  return (props: Props & P) => {
    const { hasExit = true, ...rest } = props
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const keyboardHeight = useKeyboardHeight()

    const yStart = props.placement === 'top' ? -300 : props.placement === 'bottom' ? 300 : 50
    const [closeAll, setCloseAll] = useState(false);
    const [unMount, setUnMount] = useState(false);
    const translateY = useSharedValue(yStart);
    const keyboardPaddingY = useSharedValue(props.placement === 'bottom' ? 64 : 24);
    const opacity = useSharedValue(0);
    const overlayOpacity = useSharedValue(0);

    const modalAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: withTiming(translateY.value, { duration: 200 }) }],
        opacity: withTiming(opacity.value, { duration: 200 })
      }
    });

    const avoidKeyboardAnimation = useAnimatedStyle(() => {
      return {
        paddingBottom: withSpring(keyboardPaddingY.value, defaultSpringConfig)
      }
    });

    const overlayFade = useAnimatedStyle(() => {
      return {
        opacity: withTiming(overlayOpacity.value, { duration: 300 })
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
      if (props.placement === 'top') return

      if (isKeyboardVisible) {
        keyboardPaddingY.value = withSpring(keyboardHeight, defaultSpringConfig)
      } else {
        keyboardPaddingY.value = withSpring(props.placement === 'bottom' ? 64 : 24, defaultSpringConfig)
      }
    }, [isKeyboardVisible]);

    useEffect(() => {
      if (closeAll) {
        translateY.value = withTiming(yStart, { duration: 300 })
        opacity.value = withTiming(0, { duration: 300 })
        overlayOpacity.value = withTiming(0, { duration: 300 })
        setTimeout(() => {
          setUnMount(true)
        }, 400)
      }
    }, [closeAll])

    useEffect(() => {
      if (!unMount) {
        translateY.value = withTiming(0, { duration: 200 })
        opacity.value = withTiming(1, { duration: 200 })
        overlayOpacity.value = withTiming(.8, { duration: 200 })
      } else {
        props.onClose && props.onClose()
      }
    }, [unMount])

    return (
      <>
        {!unMount &&
          <View style={[styles.full, styles.container, styles.floatedContentContainer]}>
            <Animated.View style={[overlayFade, styles.full]}>
              <Box backgroundColor='modalOverlay' style={styles.full} />
            </Animated.View>
            <Animated.View
              style={[
                styles.modal,
                modalAnimation,
                styles[`${props.placement || 'float'}Modal`]
              ]}>
              <OutsidePressHandler onOutsidePress={() => setCloseAll(true)}>
                <Box variant='modalBox' style={styles[`${props.placement || 'float'}ModalBackground`]}>
                  <Animated.View style={[styles[`${props.placement || 'float'}ModalContent`], avoidKeyboardAnimation]}>
                    <WrappedComponent {...rest as P} closeModal={() => setCloseAll(true)} />
                    {hasExit && <View style={styles.closeButton}>
                      <Button onPress={() => setCloseAll(true)} variant='circleButton' >
                        <Icon icon={X} size={20} color='secondaryText' />
                      </Button>
                    </View>}
                  </Animated.View>
                </Box>
              </OutsidePressHandler>
            </Animated.View>
          </View>}
      </>
    )
  }
}

export function withBottomModal<P>(WrappedComponent: React.FC<P & { closeModal: () => void }>) {
  const ModalComponent = withModal<P>(WrappedComponent)

  return (props: Omit<Props, 'placement'> & P) => {
    return <ModalComponent placement='bottom' {...props} />
  }
}

export function withTopModal<P>(WrappedComponent: React.FC<P & { closeModal: () => void }>) {
  const ModalComponent = withModal<P>(WrappedComponent)

  return (props: Omit<Props, 'placement'> & P) => {
    return <ModalComponent placement='top' {...props} />
  }
}
