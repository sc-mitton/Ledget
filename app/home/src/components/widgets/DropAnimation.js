import React from 'react'

import { useTransition, animated } from '@react-spring/web'

const DropAnimation = ({ visible, children, ...rest }) => {

    const transitions = useTransition(visible, {
        from: { opacity: 0, transform: 'scale(0.8)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.8)' },
        config: { duration: 80 },
    })

    return transitions((style, item) =>
        item && (
            <animated.div
                style={style}
                {...rest}
            >
                {children}
            </animated.div>
        )
    )
}

export default DropAnimation
