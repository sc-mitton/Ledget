import React, { forwardRef } from 'react'
import { useTransition, animated } from '@react-spring/web'

const DropAnimation = forwardRef((props, ref) => {
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

export default DropAnimation
