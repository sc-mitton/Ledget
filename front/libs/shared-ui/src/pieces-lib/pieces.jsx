import React, { useEffect, useState } from 'react';

import { useTransition, animated, useSpring } from '@react-spring/web'

import './styles/pieces.css'
import { Alert2 } from '@ledget/shared-assets'

export const ExpandableContainer = ({ expanded, className, children, ...rest }) => (
    <div className={`animated-container ${expanded ? 'expanded' : 'collapsed'} ${className}`} {...rest}>
        {children}
    </div>
)

export const LoadingRing = ({ color = 'light', visible }) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: visible ? 'block' : 'none',
                color: 'inherit'
            }}
        >
            <div className={`lds-ring ${color}`}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export const LoadingRingDiv = ({ color = 'light', loading, children, style, ...rest }) => {
    const transition = useTransition(!loading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    })

    return (
        <div style={{ position: 'relative', ...style }} {...rest}>
            <LoadingRing color={color} visible={loading} />
            {transition((style, item) =>
                item &&
                <animated.div style={style}>
                    {children}
                </animated.div>
            )}
        </div>
    )
}

export const FormErrorTip = ({ errors }) => {

    return (
        <>
            {
                errors.some((error) => error?.type === 'required' || error?.message === 'required') &&
                <div className='error-tip'>
                    <Alert2 />
                </div>
            }
        </>
    )
}

export const FormError = (props) => {
    const renderLines = (text) => {
        const lines = text.split('\n')
        return lines.map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>)
    }

    return (
        <>
            {props.msg && !props.msg?.includes('required') &&
                <div className="form-error--container">
                    <Alert2 />
                    <div className="form-error">
                        {renderLines(props.msg)}
                    </div>
                </div>
            }
        </>
    )
}

export const NodeImage = ({ node, attributes }) => {
    return (
        <img
            data-testid={`node/image/${attributes.id}`}
            src={attributes.src}
            alt={node.meta.label?.text}
        />
    )
}

export const JiggleDiv = ({ jiggle, children, ...rest }) => {
    const [jiggleCanBeFired, setJiggleCanBeFired] = useState(false)

    const [props, api] = useSpring(() => ({
        x: 0,
    }))

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
                    await next({ x: 12 })
                    await next({ x: -12 })
                    await next({ x: 7 })
                    await next({ x: -7 })
                    await next({ x: 3 })
                    await next({ x: -3 })
                    await next({ x: 0 })
                },
                config: { duration: 100 },
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
