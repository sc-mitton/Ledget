import React, { forwardRef } from 'react'

import { useTransition, animated } from '@react-spring/web'
import { motion } from 'framer-motion'

export const DropAnimation = forwardRef((props, ref) => {
    const { visible, children, style = {}, ...rest } = props

    const transitions = useTransition(visible, {
        from: { opacity: 0, transform: 'scale(0.85)', transformOrigin: 'top' },
        enter: { opacity: 1, transform: 'scale(1)', transformOrigin: 'top', ...style },
        leave: { opacity: 0, transform: 'scale(0.85)', transformOrigin: 'top' },
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

export const ZoomMotionDiv = ({ children, ...rest }) => (
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

export const SlideMotionDiv = ({ children, first, last, ...rest }) => (
    <motion.div

        initial={{
            opacity: first ? 1 : 0,
            x: first ? 0 : 50
        }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: last ? 50 : -50 }}
        transition={{ duration: 0.15 }}
        {...rest}
    >
        {children}
    </motion.div>
)
