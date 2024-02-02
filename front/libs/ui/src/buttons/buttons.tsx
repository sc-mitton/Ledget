import { FC, useState, forwardRef, ButtonHTMLAttributes, useEffect } from 'react';

import './buttons.scss';
import {
  FacebookLogo,
  GoogleLogo,
  Delete,
  ReplayIcon,
  Plus
} from '@ledget/media'
import { Tooltip } from '../pieces/tooltip/tooltip'
import { LoadingRing } from '../pieces/loading-indicators/loading-indicators'
import { ButtonWithClassName, withArrow, withCheckMark, withLoading } from './button-utils'
import { X, Copy, ChevronDown, ChevronsDown, Check, Circle } from '@geist-ui/icons'

export const BlackPillButton = ButtonWithClassName('btn-chcl btn-pill')
export const BlackPrimaryButton = ButtonWithClassName('btn-chcl btn3')
export const SecondaryButton = ButtonWithClassName('btn3 btn-second')
export const SecondaryButtonSlim = ButtonWithClassName('btn3 btn-second btn-2slim')
export const BluePrimaryButton = ButtonWithClassName('btn-blue btn3')
export const GrayButton = ButtonWithClassName('btn-gr btn-slim')
export const GrayArrowButton = withArrow(GrayButton)

export const MainButton = ButtonWithClassName('btn-main btn-wide')
export const GrayWideButton = ButtonWithClassName('btn-gr btn-wide')
export const LightBlueWideButton = withLoading(ButtonWithClassName('btn-blue btn-wide2'))

export const BlackSlimButton = ButtonWithClassName('btn-chcl btn-medium-slim')
export const BlackSlimButton2 = ButtonWithClassName('btn-chcl btn-medium-slim')
export const BlueSlimButton2 = ButtonWithClassName('btn-blue btn-medium-slim')
export const BlueSlimButton = ButtonWithClassName('btn-blue btn-ultra-slim')
export const SlimButton = ButtonWithClassName('btn-clr btn-medium-slim')
export const NarrowButton = ButtonWithClassName('btn-clr btn-narrow')
export const IconButton = ButtonWithClassName('btn-clr btn-icon')
export const IconButton2 = ButtonWithClassName('btn-gr2 btn-icon')
export const IconButton3 = ButtonWithClassName('btn-icon3')
export const IconScaleButton = ButtonWithClassName('btn-scale2 btn-transparent btn-icon2')
export const InputButton = ButtonWithClassName('btn-input btn-input-full')
export const SlimInputButton = ButtonWithClassName('btn-input btn-less-full')
export const SlimmestInputButton = ButtonWithClassName('btn-input btn-ultra-slim')
export const BorderedButton = ButtonWithClassName('btn-bordered btn-slim')

// Specialised Buttons
export const BlackPillButtonWithArrow = withArrow(BlackPillButton)
export const BlackPrimaryButtonWithArrow = withArrow(BlackPrimaryButton)
export const BlackSubmitWithArrow = withLoading(withArrow(BlackPrimaryButton))
export const BlueSubmitWithArrow = withLoading(withArrow(BluePrimaryButton))
export const BlackSubmitButton = withLoading(BlackPrimaryButton)
export const BlueSubmitButton = withLoading(BluePrimaryButton)
export const BlackCheckSubmitButton = withCheckMark(BlackSubmitButton)
export const BlueCheckSubmitButton = withCheckMark(BlueSubmitButton)
export const GrnSlimArrowButton = withArrow(ButtonWithClassName('btn-grn2 btn-ultra-slim'))
export const BlueSlimArrowButton = withArrow(ButtonWithClassName('btn-blue btn-ultra-slim'))
export const GreenSlimArrowSubmit = withLoading(GrnSlimArrowButton)
export const RedButton = withLoading(ButtonWithClassName('btn-red btn-slim'))
export const PrimaryTextButton = ButtonWithClassName('btn-primary-blue-text btn-slim')
export const IconButtonSubmit = withLoading(IconButton)
export const LinkArrowButton = withArrow(ButtonWithClassName('btn-icon2'))
export const FadedTextButton = ButtonWithClassName('btn-faded-text')
export const BlueTextButton = ButtonWithClassName('btn-blue-text')

export const SmallArrowButton = ({ type = '', ...rest }) => (
  <button className="arrow-nav" {...rest}>
    <div>
      <ChevronDown stroke='currentColor' size={'1.25em'} />
    </div>
  </button>
)

export const ExpandButton = ({
  flipped = false,
  size = '1.25em',
  hasBackground = true,
  ...rest
}) => (
  <button
    className={`btn-sp ${hasBackground ? 'non-clr' : ''} expand-button `}
    tabIndex={0}
    aria-label="Expand"
    {...rest}
  >
    <div className={`expand-button--icon ${flipped ? 'flipped' : ''} `}>
      <ChevronsDown size={size} />
    </div >
  </button>
)

export const FacebookLoginButton = ({ ...props }) => (
  <GrayWideButton
    className="btn-fb"
    {...props}
  >
    <FacebookLogo />
  </GrayWideButton>
)

export const GoogleLoginButton = ({ ...props }) => (
  <GrayWideButton
    className="btn-google"
    {...props}
  >
    <GoogleLogo />
  </GrayWideButton>
)

export const CloseButton =
  forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { size?: string }>((props, ref) => {
    const { size = '1.125em', className, ...rest } = props

    return (
      <CircleIconButton
        ref={ref}
        className={`close-btn ${className ? className : ''}`}
        {...rest}
      >
        <X size={size} stroke={'currentColor'} />
      </CircleIconButton>
    )
  })

export const CircleIconButton =
  forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { size?: string, darker?: boolean }>((props, ref) => {
    const { style, className, darker, ...rest } = props
    return (
      <button
        ref={ref}
        className={`btn circle-icon-btn
          ${darker ? 'darker' : ''}
          ${className ? className : ''}`}
        style={{ borderRadius: '50%', ...style }}
        {...rest}
      >
        {props.children}
      </button>
    )
  })

export const BackButton: FC<ButtonHTMLAttributes<HTMLButtonElement> & { withText?: boolean }>
  = ({ children, withText = true, ...rest }) => (
    <div>
      <button className="btn btn-2slim back-btn" {...rest}>
        <svg width="20" height="20" viewBox="0 0 20 20">
          <g transform={'translate(19, 20) rotate(-180)'}>
            <path className="arrow-tail" d="M5 10L14.5 10" stroke="currentColor" strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path className="arrow-head" d="M8 14L12 10" stroke="currentColor" strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path className="arrow-head" d="M12 10L8 6" stroke="currentColor" strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        </svg>
        {withText && <span>back</span>}
        {children}
      </button>
    </div>
  )

export const CopyButton: FC<ButtonHTMLAttributes<HTMLButtonElement> & { withText?: boolean }>
  = ({ withText = true, ...rest }) => (
    <button className="copy-btn" {...rest}>
      <Copy size={'1.25em'} />
      {withText && 'Copy'}
    </button>
  )

export const PlusButton: FC<ButtonHTMLAttributes<HTMLButtonElement>>
  = (props) => (
    <CircleIconButton {...props}>
      <Plus stroke={'currentColor'} size={'.8em'} />
    </CircleIconButton>
  )

export const DeleteButton: FC<ButtonHTMLAttributes<HTMLButtonElement> &
{ fill?: string, stroke?: string, show?: boolean, drawable?: boolean, size?: `${number}em` }>
  = ({ className, show, fill, stroke, drawable = true, size = '1em', ...rest }) => (
    <CircleIconButton
      className={`delete-button${show ? '-show' : ''}
        ${drawable ? 'drawable' : 'not-drawable'}
        ${className ? className : ''}`}
      darker={true}
      {...rest}
    >
      <Delete
        className={`animated-stroke ${drawable ? 'drawable' : 'not-drawable'}`}
        stroke={stroke}
        size={size}
      />
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

    return (
      <button
        ref={ref}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          setActive(true)
          onClick && onClick(e)
        }}
        className={`resend-btn btn3 ${active ? 'active' : ''}`}
        {...rest}
      >
        Resend
        <div className="resend-icon">
          {success ? (
            <Check
              className="resend-btn-success-icon"
              size={'1.25em'}
            />
          ) : (
            <ReplayIcon stroke={'currentColor'} size={'1.1em'} />
          )}
        </div>
      </button>
    )
  }
)

export const RefreshButton = ({ stroke = 'currentColor', hasBackground = true, loading = false, onClick = () => { }, ...rest }) => {
  const [active, setActive] = useState(false)

  useEffect(() => {
    let timeout = setTimeout(() => {
      setActive(false)
    }, 700)
    return () => {
      clearTimeout(timeout)
    }
  }, [active])

  return (
    <Tooltip msg={"Refresh"} ariaLabel={"Refresh list"}>
      {hasBackground
        ?
        <CircleIconButton
          className={`refresh-btn ${active ? 'active' : ''} ${(!active && loading) ? 'loading' : ''}`}
          onClick={() => {
            setActive(true)
            onClick()
          }}
          aria-label="Refresh"
          {...rest}
        >
          {loading && <LoadingRing visible={true} className="refresh-loading-ring" />}
          {(active || !loading) && <ReplayIcon stroke={stroke} />}
        </CircleIconButton>
        :
        <IconButton
          className={`refresh-btn-clr ${active ? 'active' : ''} ${(!active && loading) ? 'loading' : ''}`}
          aria-label="Refresh"
          onClick={() => {
            setActive(true)
            onClick()
          }}
          {...rest}
        >
          <LoadingRing visible={loading} />
          <ReplayIcon stroke={stroke} />
        </IconButton>
      }
    </Tooltip>
  )
}

export const EdgeGlowPillButton
  = ({ children, className, onClick, ...rest }:
    { className?: string, children?: React.ReactNode, onClick?: () => void }) => (
    <button
      {...rest}
      className={`${className} zipper-btn`}
      onClick={onClick}
    >
      <div>
        {children}
        <Plus size={'.9em'} stroke={'currentColor'} />
      </div>
      <span />
      <span />
    </button>
  )

export const PillOptionButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { isSelected?: boolean }>((props, ref) => {
  const { isSelected, children, className, ...rest } = props

  return (
    <button
      aria-selected={isSelected}
      ref={ref}
      className={`btn-small-pill btn ${isSelected ? 'selected' : ''} ${className ? className : ''}`}
      {...rest}
    >
      {children}
    </button>
  )
})
