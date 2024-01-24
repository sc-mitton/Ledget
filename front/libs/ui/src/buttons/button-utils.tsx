import { forwardRef, ButtonHTMLAttributes, FC, useEffect, useState } from 'react'
import { ChevronDown, Check } from '@geist-ui/icons'

import { LoadingRing } from '../pieces/loading-indicators/loading-indicators'
import { TranslucentShimmerDiv } from '../pieces/shimmer/shimmer'

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    submitting?: boolean;
    success?: boolean;
    stroke?: string;
    disabledHover?: boolean;
    rotate?: number;
}

const BaseButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
    const { className, children, ...rest } = props;
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined;

        if (clicked) {
            timeout = setTimeout(() => setClicked(false), 200);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout)
            }
        }
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

export const ButtonWithClassName = (className: string) =>
    forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
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

export const withArrow = (Component: FC<any>) => {

    return (props: LoadingButtonProps & { [key: string]: any }) => {
        const {
            children,
            className,
            disabledHover,
            loading,
            submitting,
            stroke,
            rotate = -90,
            ...rest
        } = props

        return (
            <Component
                className={`scale-icon-btn ${className} ${disabledHover || submitting || loading ? 'disabled-hover' : ''}`}
                {...rest}
            >
                {children}
                <ChevronDown stroke={'currentColor' || stroke} className='icon' />
            </Component>
        )
    }
}

export const withCheckMark = (Component: FC<any>) => {
    return (props: LoadingButtonProps) => {
        const {
            children,
            className,
            disabledHover,
            loading,
            submitting,
            stroke,
            ...rest
        } = props

        return (
            <Component
                className={`scale-icon-btn ${className} ${disabledHover || submitting || loading ? 'disabled-hover' : ''}`}
                {...rest}
            >
                {children}
                <Check size={'1em'} />
            </Component>
        )
    }
}

export const withLoading = (Component: FC<any>) => {

    return (props: LoadingButtonProps) => {

        const {
            children,
            loading,
            submitting,
            success,
            stroke,
            ...rest
        } = props

        return (
            <Component {...rest}>
                {loading && <TranslucentShimmerDiv />}
                <LoadingRing visible={submitting} />
                {!submitting && success &&
                    <Check className="checkmark--pop" size={'1em'} />
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
    }
}
