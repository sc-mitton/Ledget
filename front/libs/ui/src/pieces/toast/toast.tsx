import { useEffect, useState } from 'react'

import './toast.css'
import { CheckMark3 as CheckMarkIcon, Info as InfoIcon } from '@ledget/assets';
import { useTransition, animated } from '@react-spring/web';
import { t } from 'vitest/dist/types-198fd1d9';

export type ToastType = 'success' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export interface NewToast extends Omit<ToastItem, 'id'> { }

export type toastCleanUp = (toastId: string) => void;

export const Toast = ({ toastStack, cleanUp }: { toastStack: ToastItem[], cleanUp: toastCleanUp }) => {
  const [currentToastStack, setCurrentToastStack] = useState<ToastItem[]>([])
  const [propsToastHeight, setPropsToastHeight] = useState(0)
  const [hasNewToast, setHasNewToast] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    for (const toast of currentToastStack) {

      if (!currentToastStack.find((t) => t.id === toast.id)) {
        // toast is new and should be added to stack
        setCurrentToastStack([...currentToastStack, toast])

        // timeout for the toast to expire
        timeout = setTimeout(() => {
          cleanUp(toast.id)
          setCurrentToastStack((prev) => prev.filter((t) => t.id !== toast.id))
        }, 500)

      }
    }

    return () => clearTimeout(timeout)
  }, [hasNewToast, cleanUp])

  // Keep track of the stack height being passed as a prop,
  // and if it increase, then trigger the addition of a new
  // toast ui item
  useEffect(() => {
    if (toastStack.length > propsToastHeight) {
      setHasNewToast(true)
    } else {
      setHasNewToast(false)
    }
    setPropsToastHeight(toastStack.length)
  }, [toastStack])

  const transitions = useTransition(currentToastStack, {
    from: { opacity: 0, transform: 'scale(.9) translateY(-50%)', height: 0 },
    enter: { opacity: 1, transform: 'scale(1) translateY(0%)', height: 'auto' },
    leave: { opacity: 0, transform: 'scale(.9) translateY(50%)', height: 0 },
    config: { duration: 200 },
  })

  return (
    <div className='toast--container'>
      {/* List of toast items here */}
      {transitions((style, item) => (
        <animated.div style={style} className='toast'>
          <div>
            {item.type === 'success' && <CheckMarkIcon width={'2em'} height={'2em'} />}
            {item.type === 'info' && <InfoIcon width={'2em'} height={'2em'} />}
          </div>
          <div>
            {item.message}
          </div>
        </animated.div>
      ))
      }
    </div>
  )
}
