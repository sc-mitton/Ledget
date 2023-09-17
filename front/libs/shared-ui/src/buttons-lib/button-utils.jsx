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

    return forwardRef((props, ref) => {
        const localRef = useRef(null)
        const r = ref || localRef
        const { children, className, disabledHover, stroke, rotate = -90, ...rest } = props

        return (
            <Component
                ref={r}
                className={`scale-icon-btn ${className} ${disabledHover ? 'disabled-hover' : ''}`}
                {...rest}
            >
                {children}
                <ArrowIcon
                    width={'.8em'}
                    height={'.8em'}
                    rotation={rotate}
                    stroke={stroke || '#FFFFFF'}
                    style={{ marginLeft: '.5rem' }}
                />
            </Component>
        )
    })
}

export const withCheckMark = (Component) => {

    return forwardRef((props, ref) => {
        const localRef = useRef(null)
        const r = ref || localRef
        const { children, className, disabledHover, stroke, ...rest } = props

        return (
            <Component
                className={`scale-icon-btn ${className} ${disabledHover ? 'disabled-hover' : ''}`}
                ref={r}
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
    })
}

export const withLoadingRing = (Component) => {

    return forwardRef((props, ref) => {
        const localRef = useRef(null)
        const r = ref || localRef
        const { children, submitting, success, ...rest } = props

        const newProps = {
            disabledHover: submitting || success,
            ...rest
        }

        return (
            <Component
                {...newProps}
                ref={r}
            >
                <LoadingRing
                    visible={submitting}
                    color={props.color || "dark"}
                />
                {!submitting && success &&
                    <CheckMark className="checkmark--pop" />
                }
                <div style={{ color: submitting || success ? 'transparent' : 'inherit' }}>
                    {children}
                </div>
            </Component>
        )
    })
}
