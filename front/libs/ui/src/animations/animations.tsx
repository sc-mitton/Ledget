import React, { ReactNode, FC, forwardRef, useEffect, useState, useId } from 'react'

import { useTransition, animated, useSpring } from '@react-spring/web'
import { motion, HTMLMotionProps } from 'framer-motion'



export const DropAnimation = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement> &
{ visible: boolean, placement?: 'middle' | 'left' | 'right', transformOrigin?: 'center' | 'left' | 'right' }>((props, ref) => {
  const { visible, children, placement = 'middle', transformOrigin, style = {}, ...rest } = props

  const transitions = useTransition(visible, {
    from: {
      opacity: 0,
      y: 0,
      x: `-${placement === 'middle' ? '50%' : placement === 'left' ? '0%' : '100%'}`,
      transform: 'scale(0.85)',
      transformOrigin:
        transformOrigin
          ? `top ${transformOrigin}`
          : (`top ${placement === 'middle' ? 'center' : placement === 'left' ? 'left' : 'right'}`)
    },
    enter: {
      opacity: 1,
      transform: 'scale(1)',
      ...style
    },
    leave: {
      transform: 'scale(0.85)',
      opacity: 0,
    },
    config: {
      tension: 500,
      friction: 28,
      mass: 1,
    },
  })

  return transitions((styles, item) =>
    item && (
      <animated.div style={styles} {...rest} ref={ref}>
        {children}
      </animated.div>
    )
  )
})

export const ZoomMotionDiv: FC<HTMLMotionProps<'div'>> = ({ children, ...rest }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.15 }}
    {...rest}
  >
    {children}
  </motion.div>
)

export const SlideMotionDiv = ({ children, position, style, ...rest }
  : { children: ReactNode, position?: 'first' | 'last' | 'default' | 'fixed' } & HTMLMotionProps<'div'>) => {
  const initialMap = {
    first: { opacity: 0, x: -50 },
    last: { opacity: 0, x: 50 },
    default: { opacity: 0, x: 50 },
    fixed: { opacity: 1, x: 0 },
  }

  const exitMap = {
    first: { opacity: 0, x: -50 },
    last: { opacity: 0, x: 50 },
    default: { opacity: 0, x: -50 },
    fixed: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      initial={initialMap[position ? position : 'default']}
      animate={{ opacity: 1, x: 0 }}
      exit={exitMap[position ? position : 'default']}
      transition={{ duration: 0.1 }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export const JiggleDiv = ({ jiggle, children, ...rest }: { jiggle: boolean, children: React.ReactNode }) => {
  const [jiggleCanBeFired, setJiggleCanBeFired] = useState(false)

  const [props, api] = useSpring(() => ({ x: 0 }))

  // Jiggling shouldn't be fired on mount, so first
  // the flag (jiggleCanBeFired) needs to be dropped
  // before the animatio can be fired. This only happens
  // when the jiggle prop is false at some point, then a true
  // prop can be passed which will fire the animation
  useEffect(() => {
    if (!jiggleCanBeFired && !jiggle) {
      setJiggleCanBeFired(true)
    } else if (jiggleCanBeFired && jiggle) {
      api.start({
        to: async (next) => {
          await next({ x: 10 })
          await next({ x: -10 })
          await next({ x: 5 })
          await next({ x: -5 })
          await next({ x: 2 })
          await next({ x: -2 })
          await next({ x: 0 })
        },
        config: { duration: 90 },
        onRest: () => setJiggleCanBeFired(false)
      })
    }
  }, [jiggle])

  return (
    <animated.div style={props} {...rest}>
      {children}
    </animated.div>
  )
}

export const FadeInOutDiv = ({ immediate = false, children, className, ...rest }: { immediate?: boolean } & HTMLMotionProps<'div'>) => {
  const id = useId()

  return (
    <motion.div
      key={id}
      initial={{ opacity: immediate ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .1 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
