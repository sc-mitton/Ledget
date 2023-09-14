import React from 'react';

import { animated, useSpring } from '@react-spring/web'

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

export const LoadingRingDiv = ({ color = 'light', loading, children, ...rest }) => {
    const springProps = useSpring({
        opacity: loading ? 0 : 1,
    })

    return (
        <div style={{ position: 'relative' }} {...rest}>
            <LoadingRing color={color} visible={loading} />
            <animated.div style={springProps} {...rest}>
                {children}
            </animated.div>
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
