import React from 'react';

import { useTransition, animated } from '@react-spring/web'

import './styles/pieces.css'
import { Alert2 } from '@ledget/shared-assets'


export const ExpandableContainer = ({ expanded, className, children, ...rest }) => (
    <div className={`animated-container ${expanded ? 'expanded' : 'collapsed'} ${className}`} {...rest}>
        {children}
    </div>
)

export const LoadingRing = ({ visible }) => {
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
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export const LoadingRingDiv = ({ loading, children, style, ...rest }) => {
    const transition = useTransition(!loading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    })

    return (
        <div style={{ position: 'relative', ...style }} {...rest}>
            <LoadingRing visible={loading} />
            {transition((style, item) =>
                item &&
                <animated.div style={style}>
                    {children}
                </animated.div>
            )}
        </div>
    )
}

export const FormErrorTip = ({ errors }) => (
    <>
        {
            errors.some((error) => error?.type === 'required' || error?.message === 'required') &&
            <div className='error-tip'>
                <Alert2 />
            </div>
        }
    </>
)

export const FormError = (props) => {
    const renderLines = (text) => {
        const lines = text.split('\n')
        return lines.map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>)
    }

    return (
        <>
            {(typeof props.msg === 'string')
                ?
                props.msg && !props.msg?.includes('required') &&
                <div className="form-error--container">
                    <Alert2 />
                    <div className="form-error">
                        {renderLines(props.msg)}
                    </div>
                </div>
                :
                props.msg?.map((msg, index) => (
                    !msg.includes('required') &&
                    <div className="form-error--container" key={index}>
                        <Alert2 />
                        <div className="form-error">
                            {renderLines(msg)}
                        </div>
                    </div>
                ))
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
