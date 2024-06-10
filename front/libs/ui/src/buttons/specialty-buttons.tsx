import { FC, useState, forwardRef, ButtonHTMLAttributes, useEffect } from 'react';

import { X, Copy, ChevronsDown, Check, Plus, RotateCw } from '@geist-ui/icons'
import styled from 'styled-components';

import styles from './styles.module.scss';
import {
    FacebookLogo,
    GoogleLogo,
    Delete,
    Grip,
    CornerGrip
} from '@ledget/media'
import { Tooltip } from '../pieces/tooltip/tooltip'
import { LoadingRing } from '../pieces/loading-indicators/loading-indicators'
import { withArrow, withLoading, withCheckMark } from './hocs';
import {
    SocialButton,
    BaseButton,
    WideButton,
    GlossMini,
    gray,
    main,
    blue
} from './base';
import {
    BlackPrimaryButton,
    BluePrimaryButton,
    BlueSlimButton3,
    BlackPillButton,
    TextButton,
    FeatherGrayPillButton,
    IconButtonHalfGray
} from './styled-buttons';

export const BlackPillButtonWithArrow = withArrow(BlackPillButton)
export const BlackPrimaryButtonWithArrow = withArrow(BlackPrimaryButton)

export const BlackSubmitWithArrow = withLoading(withArrow(BlackPrimaryButton))
export const BlueSubmitWithArrow = withLoading(withArrow(BluePrimaryButton))

export const BlackSubmitButton = withLoading(BlackPrimaryButton)
export const BlueSubmitButton = withLoading(BluePrimaryButton)
export const BlueSlimSubmitButton = withLoading(BlueSlimButton3)

export const BlackCheckSubmitButton = withCheckMark(BlackSubmitButton)
export const BlueCheckSubmitButton = withCheckMark(BlueSubmitButton)

export const IconButtonSubmit = withLoading(IconButtonHalfGray)
export const LinkArrowButton = withArrow(BaseButton)
export const GlossMiniCta = withArrow(GlossMini)

export const GrayMainButton = withLoading(styled(WideButton)`${gray}`)
export const MainButton = withLoading(styled(WideButton)`${main}`)
export const LightBlueMainButton = withLoading(styled(WideButton)`${blue}`)


export const FacebookLoginButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <SocialButton {...props}> <FacebookLogo /> </SocialButton>
)

export const GoogleLoginButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <SocialButton {...props}> <GoogleLogo /> </SocialButton>
)

export const ExpandButton = ({ flipped = false, size = '1.25em', ...rest }) => (
    <BaseButton
        data-flipped={flipped}
        tabIndex={0}
        aria-label="Expand"
        className={styles.expandButton}
        {...rest}
    >
        <div><ChevronsDown size={size} /></div >
    </BaseButton>
)

export const CircleIconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'small' | 'medium' | 'large', darker?: boolean }>((props, ref) => {
    const { style, className, darker, size = 'small', color = 'gray', ...rest } = props
    return (
        <BaseButton
            ref={ref}
            className={[className, styles.circleIconButton].join(' ')}
            data-size={size}
            data-color={darker ? `${color}-darker` : color}
            tabIndex={0}
            {...rest}
        >
            {props.children}
        </BaseButton>
    )
})

export const CloseButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { size?: string }>((props, ref) => {
    const { size = '1.125em', ...rest } = props
    return (
        <CircleIconButton ref={ref} {...rest} data-size={size} className={styles.close}>
            <X size={size} stroke={'currentColor'} />
        </CircleIconButton>
    )
})

export const BackButton: FC<ButtonHTMLAttributes<HTMLButtonElement> & { withText?: boolean, text?: string }> = ({ children, text, withText = true, ...rest }) => (
    <div>
        <BaseButton className={styles.back} {...rest}>
            <svg width="20" height="20" viewBox="0 0 20 20">
                <g transform={'translate(19, 20) rotate(-180)'}>
                    <path d="M5 10L14.5 10" stroke="currentColor" strokeWidth="1"
                        strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M8 14L12 10" stroke="currentColor" strokeWidth="1"
                        strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M12 10L8 6" stroke="currentColor" strokeWidth="1"
                        strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
            </svg>
            {withText && !text && <span>back</span>}
            {text && <span>{text}</span>}
            {children}
        </BaseButton>
    </div>
)

export const CopyButton: FC<ButtonHTMLAttributes<HTMLButtonElement> & { withText?: boolean, target: string }>
    = ({ withText = true, target, ...rest }) => {
        const [copying, setCopying] = useState(false)

        useEffect(() => {
            if (copying) {
                const t = setTimeout(() => {
                    setCopying(false)
                }, 1000)
                return () => {
                    clearTimeout(t)
                }
            }
        }, [copying])

        const handleClick = () => {
            setCopying(true)
            navigator.clipboard.writeText(target)
        }

        return (
            <button onClick={handleClick} data-copying={copying} className={styles.copy} {...rest}>
                {withText && 'Copy'}
                <Copy size={'1.25em'} />
                <Check size={'1.25em'} />
            </button>
        )
    }

export const PlusButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
    <CircleIconButton {...props}>
        <Plus size='1em' />
    </CircleIconButton>
)

export const DeleteButton: FC<ButtonHTMLAttributes<HTMLButtonElement> &
{ fill?: string, stroke?: string, visible?: boolean, pop?: boolean, animated?: boolean, size?: `${number}em` }>
    = ({ className, visible, fill, stroke, pop, animated = true, size = '1em', ...rest }) => (
        <CircleIconButton
            className={styles.delete}
            darker={true}
            data-pop={pop}
            data-visible={visible}
            data-animated={animated}
            {...rest}
        >
            <Delete stroke={stroke} size={size} />
        </CircleIconButton>
    )

export const ResendButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { success: boolean }>(
    (props, ref) => {
        const { success, onClick, ...rest } = props

        const [active, setActive] = useState(false)

        useEffect(() => {
            let timeout = setTimeout(() => {
                setActive(false)
            }, 700)
            return () => {
                clearTimeout(timeout)
            }
        }, [active])

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            setActive(true)
            onClick && onClick(e)
        }

        return (
            <BaseButton
                ref={ref}
                data-active={active}
                data-success={success}
                onClick={handleClick}
                className={styles.resend}
                {...rest}
            >
                Resend
                <div>
                    {success
                        ? <Check className="resend-btn-success-icon" size={'1.25em'} />
                        : <RotateCw size={'1.1em'} />}
                </div>
            </BaseButton>
        )
    }
)

export const RefreshButton = ({ loading = false, onClick = () => { }, ...rest }) => {
    const [active, setActive] = useState(false)

    useEffect(() => {
        let timeout = setTimeout(() => {
            setActive(false)
        }, 400)
        return () => {
            clearTimeout(timeout)
        }
    }, [active])

    return (
        <Tooltip msg={"Refresh"} ariaLabel={"Refresh list"}>
            <CircleIconButton
                className={styles.refresh}
                data-active={active}
                data-loading={!active && loading}
                onClick={() => { setActive(true); onClick(); }}
                aria-label="Refresh"
                {...rest}
            >
                {!active && loading && <LoadingRing visible={true} />}
                {(active || !loading) && <RotateCw size={'1.125em'} />}
            </CircleIconButton>
        </Tooltip>
    )
}

export const RefreshButton2 = ({ loading = false, onClick = () => { }, ...rest }) => {
    const [active, setActive] = useState(false)

    useEffect(() => {
        let timeout = setTimeout(() => {
            setActive(false)
        }, 400)
        return () => {
            clearTimeout(timeout)
        }
    }, [active])

    return (
        <Tooltip msg={"Refresh"} ariaLabel={"Refresh list"}>
            <IconButtonHalfGray
                className={styles.refresh}
                data-active={active}
                data-loading={!active && loading}
                aria-label="Refresh"
                onClick={() => { setActive(true); onClick(); }}
                {...rest}
            >
                <LoadingRing visible={!active && loading} />
                <RotateCw size={'1.4em'} />
            </IconButtonHalfGray>
        </Tooltip>
    )
}

export const PillOptionButton = styled(FeatherGrayPillButton) <React.HTMLProps<HTMLButtonElement> & { isSelected?: boolean }>`
    &[data-selected="true"] {
        border: 1px solid var(--blue-sat);
    }
`
export const GripButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <BaseButton
        className={styles.grip}
        aria-label="Move"
        draggable-item="true"
        {...props}
    >
        <Grip />
    </BaseButton>
)

export const CornerGripButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={styles.cornerGrip}
        aria-label="Move"
        draggable-item="true"
        {...props}
    >
        <CornerGrip />
    </button>
)
