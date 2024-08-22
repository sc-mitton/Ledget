import { useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { PanResponder } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Box } from '../../restyled/Box'
import { defaultSpringConfig } from '../../animated/configs/configs'
import { Modal } from '../modal/Modal'

interface Props {
  collapsedHeight?: number
  expandedHeight?: number
  onDrag?: (dy: number, expanded: boolean) => void
  onExpand?: () => void
  onCollapse?: () => void
  onClose?: () => void
  children?: React.ReactNode
}

const ESCAPE_VELOCITY = 1.5
const DRAG_THRESHOLD = 100

export const BottomDrawerModal = (props: Props) => {
  const {
    collapsedHeight = 200,
    expandedHeight = Dimensions.get('window').height - 225,
  } = props

  const state = useRef<'collapsed' | 'expanded' | 'closed'>('collapsed')
  const scrollViewHeight = useSharedValue(collapsedHeight)

  const scrollViewAnimation = useAnimatedStyle(() => ({
    height: scrollViewHeight.value
  }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gs) => {
        props.onDrag && props.onDrag(gs.dy, state.current === 'expanded');
        if (state.current === 'closed') return;

        if ((Math.abs(gs.dy) > DRAG_THRESHOLD) || (Math.abs(gs.vy) > ESCAPE_VELOCITY)) {
          if (gs.vy > 0 && state.current === 'collapsed') {
            scrollViewHeight.value = withSpring(0, defaultSpringConfig)
            props.onClose && props.onClose()
            state.current = 'closed';
          } else if (gs.vy < 0) {
            scrollViewHeight.value = withSpring(
              expandedHeight,
              defaultSpringConfig);
            props.onExpand && props.onExpand();
            state.current = 'expanded';
          } else {
            scrollViewHeight.value = withSpring(
              collapsedHeight,
              defaultSpringConfig);
            props.onCollapse && props.onCollapse();
            setTimeout(() => {
              state.current = 'collapsed';
            }, 500);
          }
        } else {
          if (state.current === 'expanded') {
            scrollViewHeight.value = Math.min(expandedHeight, expandedHeight - gs.dy);
          } else {
            scrollViewHeight.value = collapsedHeight - gs.dy;
          }
        }
      },
      onPanResponderRelease: (e, gs) => {
        if (Math.abs(gs.dy) < DRAG_THRESHOLD) {
          scrollViewHeight.value = state.current === 'expanded'
            ? withSpring(expandedHeight, defaultSpringConfig)
            : withSpring(collapsedHeight, defaultSpringConfig)
          props.onDrag && props.onDrag(0, state.current === 'expanded');
        }
      },
      onPanResponderTerminationRequest: (e, gs) => {
        if (Math.abs(gs.dy) < DRAG_THRESHOLD) {
          scrollViewHeight.value = state.current === 'expanded'
            ? withSpring(expandedHeight, defaultSpringConfig)
            : withSpring(collapsedHeight, defaultSpringConfig)
          props.onDrag && props.onDrag(0, state.current === 'expanded');
        }
        return true
      },
    })
  ).current

  return (
    <Modal
      hasExitButton={false}
      hasOverlayExit={false}
      backgroundColor='modalBox100'
    >
      <View style={styles.buttonContainer} {...panResponder.panHandlers} >
        <Box style={styles.button} backgroundColor='dragBar' />
      </View>
      <Animated.View style={[scrollViewAnimation]}>
        {props.children}
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '30%',
    height: 5,
    borderRadius: 5,
    maxWidth: 70,
    top: 6,
    position: 'absolute'
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    marginVertical: -12,
    paddingBottom: 18,
    position: 'relative',
  }
})
