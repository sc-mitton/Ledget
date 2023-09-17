import React, { useState } from 'react'

import './styles/shimmer.css'
import { useTransition, animated } from '@react-spring/web'
import { TextInput } from '../inputs-lib/textInputs'


export const ShimmerDiv = (props) => {
    const { shimmering, children, style, ...rest } = props
    const [position, setPosition] = useState('static')
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
                setPosition('static')
            }
        }
    })

    return (
        <div
            className="loading-shimmer--container"
            style={{ position: position, ...style }}
            {...rest}
        >
            {transitions(
                (styles, item) => item &&
                    <animated.div style={styles} className="loading-shimmer">
                        <div className="shimmer"></div>
                    </animated.div>
            )}
            {!shimmering && children}
        </div>
    )
}

export const BlockShimmerDiv = (props) => {
    const { id, className } = props

    return (
        <TextInput id={id} className={className}>
            <span style={{ color: 'transparent' }}>Shimmering</span>
            <div className='block-shimmer--container'>
                <ShimmerDiv shimmering={true} />
            </div>
        </TextInput>
    )
}

export const TranslucentShimmerDiv = (props) => (
    <div className="translucent-shimmer--container">
        <ShimmerDiv shimmering={true} />
    </div>
)
