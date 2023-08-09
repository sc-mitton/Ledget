import React from 'react'

import './styles/LoadingShimmer.css'
import { useTransition, animated } from '@react-spring/web'

const LoadingShimmer = ({ visible }) => {
    const transitions = useTransition(visible, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })

    return (
        transitions(
            (styles, item) => item &&
                <animated.div
                    className="loading-shimmer"
                    style={styles}
                >
                </animated.div>
        )
    )
}

export default LoadingShimmer
