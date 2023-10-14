import { forwardRef, ButtonHTMLAttributes, ComponentType, FC, useRef, useEffect, useState } from 'react'

import { LoadingRing } from '../pieces/pieces'
import { TranslucentShimmerDiv } from '../pieces/shimmer'
import { ArrowIcon, CheckMark } from '@ledget/assets'

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

interface LoadingButtonProps extends BaseButtonProps {
    loading?: boolean;
    submitting?: boolean;
    success?: boolean;
    stroke?: string;
    disabledHover?: boolean;
    rotate?: number;
}

const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
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

export const ButtonWithClassName = (className: string) => forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
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
                <ArrowIcon
                    width={'.8em'}
                    height={'.8em'}
                    rotation={rotate}
                    stroke={'currentColor' || stroke}
                    style={{ marginLeft: '.5rem' }}
                />
            </Component>
        )
    }
}

export const withCheckMark = (Component: FC<any>) => {
    return (props: LoadingButtonProps & { [key: string]: any }) => {
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
                <CheckMark
                    width={'.8em'}
                    height={'.8em'}
                    stroke={'currentColor' || stroke}
                />
            </Component>
        )
    }
}

export const withLoading = (Component: FC<any>) => {

    return (props: LoadingButtonProps & { [key: string]: any }) => {

        const {
            children,
            className,
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
    }
}
