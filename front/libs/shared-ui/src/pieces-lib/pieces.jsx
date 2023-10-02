import React from 'react';

import { useTransition, animated } from '@react-spring/web'

import './styles/pieces.css'
import { Alert2 } from '@ledget/shared-assets'
import { CheckMark, SmsAuthIcon, ReplayIcon } from '@ledget/shared-assets'
import authenticator from '@ledget/shared-assets/src/images/authenticator.svg'
import recoveryCodeGraphic from '@ledget/shared-assets/src/images/recoveryCodeGraphic.svg'
import { shuffleArray } from '@ledget/shared-utils'

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

export const StatusPulse = ({ positive, colorDefaultPositive, size }) => (
    <>
        <div
            id="inner-circle"
            className={`status-circle ${positive ? 'positive' : 'negative'} ${colorDefaultPositive ? 'color-default-positive' : ''} ${size}`}
        />
        <div
            id="outer-circle"
            className={`status-circle ${positive ? 'positive' : 'negative'} ${colorDefaultPositive ? 'color-default-positive' : ''} ${size}`}
        />
    </>
)

export const TotpAppGraphic = (props) => {
    const { finished } = props

    return (
        <div className="auth-factor-status-graphic">
            {finished &&
                <div id="success-checkmark">
                    <CheckMark
                        stroke={'var(--green-dark'}
                    />
                </div>
            }
            <img src={authenticator} alt="Authenticator" />
            <StatusPulse positive={finished} size="medium-large" />
        </div>
    )
}

export const RecoveryCodeGraphic = (props) => (
    <div className="auth-factor-status-graphic">
        <img src={recoveryCodeGraphic} alt="Authenticator" />
        <StatusPulse positive={props.finished} size="medium" />
    </div>
)


export const KeyPadGraphic = (props) => {
    const { finished } = props
    const nums = Array(10).fill().map((_, index) => index + 1)
    const shuffledNums = shuffleArray(
        Array(10).fill().map((_, index) => index + 1)
    )

    return (
        <div className={`keypad-graphic-status ${finished ? 'finished' : 'unfinished'}`}>
            {nums.map((num, index) => (
                <div
                    key={index}
                    style={{ '--key-animation-delay': shuffledNums[index] }}
                >
                    {num}
                </div>
            ))}
        </div>
    )
}

export const SmsVerifyStatus = (props) => (
    <div className="sms-verify-status">
        {props.finished &&
            <div id="success-checkmark">
                <CheckMark
                    stroke={'var(--green-hlight'}
                />
            </div>
        }
        <SmsAuthIcon
            width={'3.5em'}
            height={'3.5em'}
        />
        <StatusPulse positive={props.finished} size="medium" />
    </div>
)
