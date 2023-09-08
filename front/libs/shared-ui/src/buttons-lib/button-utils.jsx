import React, { forwardRef, useRef } from 'react'

import { LoadingRing } from '../pieces-lib/pieces'
import { ArrowIcon, CheckMark } from '@ledget/shared-assets'

export const BaseButton = forwardRef((props, ref) => {
    const { className, children, ...rest } = props
    const localRef = useRef(null)
    const r = ref || localRef

    return (
        <button
            ref={r}
            className={`btn ${className}`}
            {...rest}
        >
            {children}
        </button>
    )
})

export const ButtonWithClassName = (className) => forwardRef((props, ref) => {
    const { children, className: classNameInner, ...rest } = props
    const localRef = useRef(null)
    const r = ref || localRef

    return (
        <BaseButton
            ref={r}
            className={`${className} ${classNameInner ? classNameInner : ''}`}
            {...rest}
        >
            {children}
        </BaseButton>
    )
})

export const withArrow = (Component) => {

    return (props) => {
        const { children, className, disabledHover, stroke, ...rest } = props

        return (
            <Component
                className={`scale-icon-btn ${className} ${disabledHover ? 'disabled-hover' : ''}`}
                {...rest}
            >
                {children}
                <ArrowIcon
                    width={'.8em'}
                    height={'.8em'}
                    rotation={-90}
                    stroke={stroke || '#FFFFFF'}
                    style={{ marginLeft: '.5rem' }}
                />
            </Component>
        )
    }
}

export const withCheckMark = (Component) => {
    return (props) => {
        const { children, className, disabledHover, stroke, ...rest } = props
        return (
            <Component
                className={`scale-icon-btn ${className} ${disabledHover ? 'disabled-hover' : ''}`}
                {...rest}
            >
                {children}
                <CheckMark
                    width={'.8em'}
                    height={'.8em'}
                    style={{ marginLeft: '.5rem' }}
                />
            </Component>
        )
    }
}

export const withLoadingRing = (Component) => {
    return (props) => {
        const { children, submitting, ...rest } = props

        return (
            <Component {...rest}>
                <LoadingRing
                    visible={submitting}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                    color="dark"
                />
                <div style={{ color: submitting ? 'transparent' : 'inherit' }}>
                    {children}
                </div>
            </Component>
        )
    }
}
