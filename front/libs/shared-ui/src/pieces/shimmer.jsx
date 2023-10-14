import React from 'react'

import './styles/shimmer.css'
import { useTransition, animated } from '@react-spring/web'
import { TextInput } from '../inputs/textInputs'


export const Shimmer = ({ shimmering }) => {
    const transitions = useTransition(shimmering, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    })

    return (
        <>
            {transitions(
                (styles, item) => item &&
                    <animated.div
                        style={styles}
                        className="loading-shimmer"
                    >
                        <div className="shimmer" />
                    </animated.div>
            )}
        </>
    )
}

export const ShimmerDiv = (props) => {
    const { shimmering, children, style, background, ...rest } = props

    return (
        <div
            className="loading-shimmer--container"
            style={{
                position: 'relative',
                ...((background && shimmering) ? { backgroundColor: background } : {}),
                ...style
            }}
            {...rest}
        >
            <Shimmer shimmering={shimmering} />
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
