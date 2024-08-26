import { useRef, createContext, useContext, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { PanResponder } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Box } from '../../restyled/Box'
import { defaultSpringConfig } from '../../animated/configs/configs'
import { Modal } from '../modal/Modal'

interface ContentProps {
  onDrag?: (dy: number, expanded: boolean) => void
  onExpand?: () => void
  onCollapse?: () => void
  onClose?: () => void
  children?: React.ReactNode
}

interface ContextProps {
  collapsedHeight: number
  expandedHeight: number
  state: React.MutableRefObject<"collapsed" | "expanded" | "closed">
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

interface BottomDrawerModalProps extends Partial<ContextProps> {
  children?: React.ReactNode | ((props: { expanded: boolean }) => React.ReactNode);
  defaultExpanded?: boolean
}

const BottomDrawerModalContext = createContext<ContextProps | undefined>(undefined)

const useBottomDrawerModal = () => {
  const context = useContext(BottomDrawerModalContext)
  if (!context) {
    throw new Error('useBottomDrawerModal must be used within a BottomDrawerModalProvider')
  }
  return context
}

const ESCAPE_VELOCITY = 1.5
const DRAG_THRESHOLD = 100

const BottomDrawerModal = (props: BottomDrawerModalProps) => {
  const {
    children,
    collapsedHeight = 150,
    expandedHeight = Dimensions.get('window').height - 250,
  } = props
  const state = useRef<'collapsed' | 'expanded' | 'closed'>(props.defaultExpanded ? 'expanded' : 'collapsed')
  const [expanded, setExpanded] = useState<boolean>(props.defaultExpanded || false)

  return (
    <BottomDrawerModalContext.Provider value={{ collapsedHeight, expandedHeight, state, setExpanded }}>
      <Modal
        hasOverlayExit={false}
        hasExitButton={false}
      >
        {typeof children === 'function' ? children({ expanded }) : children}
      </Modal>
    </BottomDrawerModalContext.Provider>
  )
}

const Content = (props: ContentProps) => {
  const { collapsedHeight, expandedHeight, state, setExpanded } = useBottomDrawerModal()

  const scrollViewHeight = useSharedValue(state.current === 'expanded' ? expandedHeight : collapsedHeight)

  const scrollViewAnimation = useAnimatedStyle(() => ({
    height: scrollViewHeight.value
  }));

  const updateExpanded = (expanded: boolean) => {
    setExpanded(expanded)
  }

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
            updateExpanded(true)
            state.current = 'expanded';
          } else {
            scrollViewHeight.value = withSpring(
              collapsedHeight,
              defaultSpringConfig);
            props.onCollapse && props.onCollapse();
            updateExpanded(false)
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
    <>
      <View style={styles.buttonContainer} {...panResponder.panHandlers} >
        <Box style={styles.button} backgroundColor='dragBar' />
      </View>
      <Animated.View style={[scrollViewAnimation]}>
        {props.children}
      </Animated.View>
    </>
  )
}

BottomDrawerModal.Content = Content

export { BottomDrawerModal }

const styles = StyleSheet.create({
  button: {
    width: '30%',
    height: 5,
    borderRadius: 5,
    maxWidth: 70,
  },
  buttonContainer: {
    top: 6,
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    marginVertical: -18,
    paddingBottom: 18
  }
})
