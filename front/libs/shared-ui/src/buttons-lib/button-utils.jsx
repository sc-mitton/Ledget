import React, { forwardRef, useRef, useEffect, useState } from 'react'

import { LoadingRing } from '../pieces-lib/pieces'
import { TranslucentShimmerDiv } from '../pieces-lib/shimmer'
import { ArrowIcon, CheckMark } from '@ledget/shared-assets'

export const BaseButton = forwardRef((props, ref) => {
    const { className, children, ...rest } = props
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        let timeout
        if (clicked) {
            timeout = setTimeout(() => setClicked(false), 200)
        }
        return () => clearTimeout(timeout)
    }, [clicked])

    return (
        <button
            ref={ref}
            onMouseDown={() => setClicked(true)}
            className={`btn ${className} ${clicked ? 'clicked' : ''}`}
            {...rest}
        >
            {children}
        </button>
    )
})

export const ButtonWithClassName = (className) => forwardRef((props, ref) => {
    const { children, className: classNameInner, ...rest } = props

    return (
        <BaseButton
            ref={ref}
            className={`${className} ${classNameInner ? classNameInner : ''}`}
            {...rest}
        >
            {children}
        </BaseButton>
    )
})

export const withArrow = (Component) => {

    return forwardRef((props, ref) => {
        const { children, className, disabledHover, loading,
            submitting, stroke, rotate = -90, ...rest } = props

        return (
            <Component
                ref={ref}
                className={`scale-icon-btn ${className} ${disabledHover || submitting || loading ? 'disabled-hover' : ''}`}
                {...rest}
            >
                {children}
                <ArrowIcon
                    width={'.8em'}
                    height={'.8em'}
                    rotation={rotate}
                    stroke={'currentColor' || stroke}
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
        const { children, className, disabledHover, loading, submitting, stroke, ...rest } = props

        return (
            <Component
                className={`scale-icon-btn ${className} ${disabledHover || submitting || loading ? 'disabled-hover' : ''}`}
                ref={r}
                {...rest}
            >
                {children}
                <CheckMark
                    width={'.8em'}
                    height={'.8em'}
                    stroke={'currentColor'}
                />
            </Component>
        )
    })
}

export const withLoading = (Component) => {

    return forwardRef((props, ref) => {
        const localRef = useRef(null)
        const r = ref || localRef
        const { children, ...rest } = props
        const { loading, submitting, success } = props

        return (
            <Component {...rest} ref={r}>
                {loading && <TranslucentShimmerDiv />}
                <LoadingRing visible={submitting} />
                {!submitting && success &&
                    <CheckMark className="checkmark--pop" stroke={'currentColor'} />
                }
                <div
                    className="with-loading-ring--container"
                    style={{
                        visibility: loading || submitting || success ? 'hidden' : 'visible',
                    }}
                >
                    {children}
                </div>
            </Component>
        )
    })
}
