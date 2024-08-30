import { useEffect, useRef } from 'react';
import { View, NativeModules } from 'react-native';
import { useTransition, animated, useSpringRef } from '@react-spring/web';

import styles from './styles/stack';
import { ToastItem as TToastItem } from "@ledget/shared-features";
import ToastItem from "./Item";

const { StatusBarManager } = NativeModules;
const AnimatedView = animated(View)

export const ToastStack = ({ stack }: { stack: TToastItem[] }) => {
  const itemDimensions = useRef({ width: 0, height: 0 })

  const ref = useSpringRef()
  const transitions = useTransition(stack, {
    from: { opacity: 0, top: -100 },
    enter: (item, index) => ({
      opacity: 1,
      x: 0,
      top: index * (itemDimensions.current.height + 16),
    }),
    leave: { opacity: 0, x: -1 * itemDimensions.current.width },
    ref,
  })

  useEffect(() => {
    ref.start()
  }, [stack])

  return (
    <View style={[styles.toastStack, { top: StatusBarManager.HEIGHT + 8 }]}>
      {transitions((style, item) => (
        <AnimatedView
          key={item.id}
          style={style}
          onLayout={(e) => { itemDimensions.current = e.nativeEvent.layout }}
        >
          <ToastItem {...item} />
        </AnimatedView>
      ))}
    </View>
  )
}
