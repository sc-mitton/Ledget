import { FC, useState, useEffect } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { View, TouchableWithoutFeedback } from 'react-native'
import { X } from 'geist-native-icons';

import styles from './styles';
import { Box } from '../../restyled/Box';
import { Icon } from '../../restyled/Icon';
import { Button } from '../../restyled/Button';

interface Props {
  onClose?: () => void,
  hasExit?: boolean,
}

const yStart = 300

export function withBottomModal<P>(WrappedComponent: FC<P & { closeModal: () => void }>) {
  return (props: Props & P) => {
    const {
      hasExit = true,
      ...rest
    } = props

    const [closeAll, setCloseAll] = useState(false)
    const [unMount, setUnMount] = useState(false)
    const translateY = useSharedValue(yStart)
    const opacity = useSharedValue(0)
    const overlayOpacity = useSharedValue(0)

    const modalAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: withTiming(translateY.value, { duration: 300 }) }],
        opacity: withTiming(opacity.value, { duration: 300 })
      }
    });

    const overlayFade = useAnimatedStyle(() => {
      return {
        opacity: withTiming(overlayOpacity.value, { duration: 500 })
      }
    });

    useEffect(() => {
      if (closeAll) {
        translateY.value = withTiming(yStart, { duration: 300 })
        opacity.value = withTiming(0, { duration: 300 })
        overlayOpacity.value = withTiming(0, { duration: 300 })
        setTimeout(() => {
          setUnMount(true)
        }, 500)
      }
    }, [closeAll])

    useEffect(() => {
      if (!unMount) {
        translateY.value = withTiming(0, { duration: 300 })
        opacity.value = withTiming(1, { duration: 300 })
        overlayOpacity.value = withTiming(.5, { duration: 300 })
      } else {
        props.onClose && props.onClose()
      }
    }, [unMount])

    return (
      <>
        {!unMount &&
          <TouchableWithoutFeedback onPress={() => setCloseAll(true)}>
            <View style={[styles.full, styles.container]}>
              <Animated.View style={[overlayFade, styles.full]}>
                <Box backgroundColor='modalOverlay' style={styles.full} />
              </Animated.View>
              <Animated.View style={[styles.modal, modalAnimation]}>
                <Box variant='modalBox' style={styles.background}>
                  <View style={styles.modalContent}>
                    <WrappedComponent {...rest as P} closeModal={() => setCloseAll(true)} />
                    {hasExit && <View style={styles.closeButton}>
                      <Button onPress={() => setCloseAll(true)} variant='circleButton' >
                        <Icon icon={X} size={20} color='secondaryText' />
                      </Button>
                    </View>}
                  </View>
                </Box>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>}
      </>
    )
  }
}

