import React from 'react'

import { useTransition, animated } from '@react-spring/web'


const StretchOn = (props) => {
    const { visible, style, children, ...rest } = props

    const transitions = useTransition(visible, {
        from: { width: '0%' },
        enter: { width: '100%', ...style },
        leave: { width: '0%' },
        config: {
            tension: 30,
            friction: 20,
            mass: 1,
        },
    })

    return transitions((style, item) =>
        item && <animated.div style={style} {...rest}>
            {children}
        </animated.div>
    )
}

export default StretchOn
