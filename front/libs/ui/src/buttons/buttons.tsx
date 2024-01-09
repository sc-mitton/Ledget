import { FC, useState, forwardRef, ButtonHTMLAttributes, useEffect } from 'react';

import './buttons.scss';
import {
  ExpandIcon,
  ArrowIcon,
  FacebookLogo,
  CloseIcon,
  GoogleLogo,
  CopyIcon,
  Delete,
  ReplayIcon,
  CheckMark,
  Plus
} from '@ledget/media'
import { Tooltip } from '../pieces/tooltip/tooltip'
import { LoadingRing } from '../pieces/loading-indicators/loading-indicators'
import { ButtonWithClassName, withArrow, withCheckMark, withLoading } from './button-utils'

export const BlackPillButton = ButtonWithClassName('btn-chcl btn-pill')
export const BlackPrimaryButton = ButtonWithClassName('btn-chcl btn3')
export const SecondaryButton = ButtonWithClassName('btn3 btn-second')
export const SecondaryButtonSlim = ButtonWithClassName('btn3 btn-second btn-2slim')
export const GrnPrimaryButton = ButtonWithClassName('btn-grn2 btn3')
export const BluePrimaryButton = ButtonWithClassName('btn-blue btn3')
export const GrayButton = ButtonWithClassName('btn-gr btn-slim')
export const GrayArrowButton = withArrow(GrayButton)

export const DarkWideButton = ButtonWithClassName('btn-dark btn-wide')
export const GrnWideButton = ButtonWithClassName('btn-grn btn-wide')
export const GrayWideButton = ButtonWithClassName('btn-gr btn-wide')
export const LightGrnWideButton = withLoading(ButtonWithClassName('btn-grn btn-wide2'))

export const BlackSlimButton = ButtonWithClassName('btn-chcl btn-slim')
export const BlackSlimButton2 = ButtonWithClassName('btn-chcl btn-2slim')
export const GrnSlimButton = ButtonWithClassName('btn-grn2 btn-slim')
export const GrnSlimButton2 = ButtonWithClassName('btn-grn2 btn-2slim')
export const BlueSlimButton2 = ButtonWithClassName('btn-blue btn-2slim')
export const BlueSlimButton = ButtonWithClassName('btn-blue btn-slim')
export const GreenSlimButton = ButtonWithClassName('btn-grn btn-slim')
export const SlimButton = ButtonWithClassName('btn-clr btn-2slim')
export const NarrowButton = ButtonWithClassName('btn-clr btn-narrow')
export const IconButton = ButtonWithClassName('btn-clr btn-icon')
export const IconButton2 = ButtonWithClassName('btn-gr2 btn-icon')
export const IconScaleButton = ButtonWithClassName('btn-scale2 btn-transparent btn-icon2')
export const InputButton = ButtonWithClassName('btn-input btn-input-full')
export const SlimInputButton = ButtonWithClassName('btn-input btn-less-full')
export const SlimmestInputButton = ButtonWithClassName('btn-input btn-3slim')

// Specialised Buttons
export const BlackPillButtonWithArrow = withArrow(BlackPillButton)
export const BlackPrimaryButtonWithArrow = withArrow(BlackPrimaryButton)
export const BlackSubmitWithArrow = withLoading(withArrow(BlackPrimaryButton))
export const GreenSubmitWithArrow = withLoading(withArrow(GrnPrimaryButton))
export const BlueSubmitWithArrow = withLoading(withArrow(BluePrimaryButton))
export const BlackSubmitButton = withLoading(BlackPrimaryButton)
export const GreenSubmitButton = withLoading(GrnPrimaryButton)
export const BlueSubmitButton = withLoading(BluePrimaryButton)
export const BlackCheckSubmitButton = withCheckMark(BlackSubmitButton)
export const GreenCheckSubmitButton = withCheckMark(GreenSubmitButton)
export const BlueCheckSubmitButton = withCheckMark(BlueSubmitButton)
export const GrnSlimArrowButton = withArrow(ButtonWithClassName('btn-grn2 btn-slim'))
export const BlueSlimArrowButton = withArrow(ButtonWithClassName('btn-blue btn-slim'))
export const GreenSlimArrowSubmit = withLoading(GrnSlimArrowButton)
export const RedButton = withLoading(ButtonWithClassName('btn-red btn-2slim'))
export const PrimaryTextButton = ButtonWithClassName('btn-grn-text btn-2slim')
export const IconButtonSubmit = withLoading(IconButton)
export const LinkArrowButton = withArrow(ButtonWithClassName('btn-icon2'))

export const SmallArrowButton = ({ type = '', ...rest }) => (
  <button className="arrow-nav" {...rest}>
    <div>
      <ArrowIcon stroke='currentColor' scale={.7} rotation={type === "back" ? 90 : -90} />
    </div>
  </button>
)

export const ExpandButton = ({
  flipped = false,
  size = '.7em',
  hasBackground = true,
  ...rest
}) => (
  <button
    className={`btn-sp ${hasBackground ? 'btn-gr2' : 'btn-clr'} expand-button `}
    tabIndex={0}
    aria-label="Expand"
    {...rest}
  >
    <div className={`expand-button--icon ${flipped ? 'flipped' : ''} `}>
      <ExpandIcon stroke={"currentColor"} size={size} />
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
    const { size, className, ...rest } = props

    return (
      <button
        ref={ref}
        className={`btn-gr btn btn-icon close-btn ${className ? className : ''}`}
        {...rest}
      >
        <CloseIcon size={size} />
      </button>
    )
  })

export const CircleIconButton =
  forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { size?: string }>((props, ref) => {
    const { style, className, ...rest } = props
    return (
      <button
        ref={ref}
        className={`btn circle-icon-btn ${className ? className : ''}`}
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
            <path className="arrow-tail" d="M5 10L12.5 10" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path className="arrow-head" d="M8 14L12 10" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path className="arrow-head" d="M12 10L8 6" stroke="currentColor" strokeWidth="2"
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
      <CopyIcon />
      {withText && 'Copy'}
    </button>
  )

export const PlusPill: FC<ButtonHTMLAttributes<HTMLButtonElement> & { styled?: 'chcl' | 'grn' | 'gr' | 'input' }>
  = ({ styled = 'chcl', ...rest }) => (
    <button className={`btn-circle  btn-${styled}`} {...rest}>
      <Plus stroke={'currentColor'} />
    </button>
  )

export const DeleteButton: FC<ButtonHTMLAttributes<HTMLButtonElement> &
{ fill?: string, stroke?: string, show?: boolean, styled?: 'input', drawable?: boolean }>
  = ({ className, show, fill, stroke, styled, drawable = true, ...rest }) => (
    <button
      className={`btn delete-button${show ? '-show' : ''}
        ${styled === 'input' ? 'input' : ''}
        ${drawable ? 'drawable' : 'not-drawable'}
        ${className ? className : ''}`}
      {...rest}
    >
      <Delete
        className={`animated-stroke ${drawable ? 'drawable' : 'not-drawable'}`}
        fill={fill}
        stroke={stroke}
        size={'1.2em'}
        border={styled === 'input' ? 'var(--input-border-color)' : ''}
      />
    </button>
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
            <CheckMark
              className="resend-btn-success-icon"
              stroke={'currentColor'}
              size={'.8em'}
            />
          ) : (
            <ReplayIcon fill={'currentColor'} size={'1.1em'} />
          )}
        </div>
      </button>
    )
  }
)

export const RefreshButton = ({ fill = 'currentColor', hasBackground = true, loading = false, onClick = () => { }, ...rest }) => {
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
    <Tooltip
      msg={"Refresh"}
      ariaLabel={"Refresh list"}
    >
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
          {(active || !loading) && <ReplayIcon fill={fill} />}
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
          <div style={{ opacity: loading ? 0 : 1 }}><ReplayIcon fill={fill} /></div>
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
      className={`btn-small-pill btn btn-gr2 ${isSelected ? 'selected' : ''} ${className ? className : ''}`}
      {...rest}
    >
      {children}
    </button>
  )
})
