import React, { useEffect, useState } from 'react'

import './styles/ShimmerDiv.css'
import { useTransition, animated } from '@react-spring/web'

const ShimmerDiv = (props) => {
    const { shimmering, children, ...rest } = props
    const [position, setPosition] = useState('relative')
    const transitions = useTransition(shimmering, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        onStart: () => {
            if (shimmering) {
                setPosition('relative')
            }
        },
        onDestroyed: () => {
            if (!shimmering) {
                setPosition('relative')
            }
        }
    })

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: position,
            }}
            {...rest}
        >
            {transitions(
                (styles, item) => item &&
                    <animated.div
                        className="loading-shimmer-container"
                        style={styles}
                    >
                        <div className="loading-shimmer"></div>
                    </animated.div>
            )}
            {!shimmering && children}
        </div>
    )
}

export default ShimmerDiv
