import React from 'react'

import { useTransition, animated, config } from '@react-spring/web'

const DropAnimation = ({ visible, children, style = {}, ...rest }) => {

    const transitions = useTransition(visible, {
        from: { opacity: 0, transform: 'scale(0.85)', transformOrigin: 'top' },
        enter: { opacity: 1, transform: 'scale(1)', transformOrigin: 'top', ...style },
        leave: { opacity: 0, transform: 'scale(0.85)', transformOrigin: 'top' },
        config: {
            tension: 400,
            friction: 28,
            mass: 1
        },
    })

    return transitions((styles, item) =>
        item && (
            <animated.div
                style={styles}
                {...rest}
            >
                {children}
            </animated.div>
        )
    )
}

export default DropAnimation
