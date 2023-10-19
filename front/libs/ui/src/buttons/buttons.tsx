import { useState, forwardRef, ReactNode, ButtonHTMLAttributes, useEffect } from 'react';

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
export const SecondaryButton = ButtonWithClassName('btn3 btn-scale btn-scale btn-second')
export const GrnPrimaryButton = ButtonWithClassName('btn-grn2 btn3')
export const GrayButton = ButtonWithClassName('btn-gr3 btn-slim')
export const GrayArrowButton = withArrow(GrayButton)

export const BlackWideButton = ButtonWithClassName('btn-chcl btn-wide')
export const GrnWideButton = ButtonWithClassName('btn-grn btn-wide')
export const GrayWideButton = ButtonWithClassName('btn-gr btn-wide')
export const LightGrnWideButton = ButtonWithClassName('btn-grn2 btn-wide2')

export const BlackSlimButton = ButtonWithClassName('btn-chcl btn-slim')
export const BlackSlimButton2 = ButtonWithClassName('btn-chcl btn-2slim')
export const GrnSlimButton = ButtonWithClassName('btn-grn2 btn-slim')
export const GrnSlimButton2 = ButtonWithClassName('btn-grn2 btn-2slim')
export const SlimButton = ButtonWithClassName('btn-clr btn-2slim')
export const NarrowButton = ButtonWithClassName('btn-clr btn-narrow')
export const IconButton = ButtonWithClassName('btn-clr btn-icon')
export const IconButton2 = ButtonWithClassName('btn-gr2 btn-icon2')
export const IconScaleButton = ButtonWithClassName('btn-scale2 btn-transparent btn-icon2')
export const InputButton = ButtonWithClassName('btn-input btn-input-full')
export const SlimInputButton = ButtonWithClassName('btn-input2 btn-2slim')

// Specialised Buttons
export const BlackPillButtonWithArrow = withArrow(BlackPillButton)
export const BlackPrimaryButtonWithArrow = withArrow(BlackPrimaryButton)
export const BlackSubmitWithArrow = withLoading(withArrow(BlackPrimaryButton))
export const GreenSubmitWithArrow = withLoading(withArrow(GrnPrimaryButton))
export const BlackSubmitButton = withLoading(BlackPrimaryButton)
export const GreenSubmitButton = withLoading(GrnPrimaryButton)
export const BlackCheckSubmitButton = withCheckMark(BlackSubmitButton)
export const GreenCheckSubmitButton = withCheckMark(GreenSubmitButton)
export const GrnSlimArrowButton = withArrow(ButtonWithClassName('btn-grn2 btn-slim'))
export const GreenSlimArrowSubmit = withLoading(GrnSlimArrowButton)
export const RedButton = withLoading(ButtonWithClassName('btn-red btn-2slim'))
export const GrnTextButton = ButtonWithClassName('btn-grn-text btn-2slim')
export const IconButtonSubmit = withLoading(IconButton)
export const LinkArrowButton = withArrow(ButtonWithClassName('btn-icon2'))

export const SmallArrowButton = ({ type = '', ...rest }) => (
  <button className="arrow-nav btn-scale2" {...rest}>
    <ArrowIcon stroke='var(--m-text-gray)' scale={.8} rotation={type === "back" ? 90 : -90} />
  </button>
)

export const ExpandButton = ({ flipped = false, ...rest }) => (
  <button
    className={`btn-sp btn-discreet expand-button `}
    id="expand-button"
    tabIndex={0}
    aria-label="Expand"
    {...rest}
  >
    <div className={`expand-button--icon ${flipped ? 'flipped' : ''} `}>
      <ExpandIcon stroke={"var(--faded-text)"} />
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

export const CloseButton = ({ className = '', ...rest }) => {

  return (
    <button
      className={`btn-clr btn btn-icon close-btn ${className}`}
      {...rest}
    >
      <CloseIcon />
    </button>
  )
}

export const BackButton = ({ children, withText = true, ...rest }: { children: ReactNode, withText: boolean }) => (
  <div>
    <button className="btn btn-2slim back-btn" {...rest}>
      <svg width="20" height="20" viewBox="0 0 20 20">
        <g transform={'translate(19, 20) rotate(-180)'}>
          <path className="arrow-tail" d="M5 10L12.5 10" stroke="#292929" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path className="arrow-head" d="M8 14L12 10" stroke="#292929" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path className="arrow-head" d="M12 10L8 6" stroke="#292929" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
      {withText && <span>back</span>}
      {children}
    </button>
  </div>
)

export const CopyButton = ({ withText = true, ...rest }) => (
  <SlimInputButton className="copy-btn" {...rest}>
    <CopyIcon />
    {withText && 'Copy'}
  </SlimInputButton>
)

export const PlusPill = ({ ...props }) => (
  <button className="btn-chcl btn-circle btn-scale2" {...props}>
    <Plus stroke={'var(--window)'} width={'.9em'} height={'.9em'} />
  </button>
)

export const DeleteButton = ({ className, ...rest }: { className: string }) => (
  <button className={`btn delete-button ${className}`} {...rest}>
    <Delete width={'1.3em'} height={'1.3em'} />
  </button>
)

export const ResendButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { success: boolean }>(
  (props, ref) => {
    const [rotation, setRotation] = useState(0);
    const { success, ...rest } = props

    return (
      <button
        ref={ref}
        onClick={() => setRotation(rotation + 360)}
        className="resend-btn"
        {...rest}
      >
        Resend
        <div className="resend-icon">
          {success ? (
            <CheckMark
              className="resend-btn-success-icon"
              stroke={'currentColor'}
              height={'.8em'}
              width={'.8em'}
            />
          ) : (
            <ReplayIcon fill={'currentColor'} />
          )}
        </div>
      </button>
    );
  }
);


export const RefreshButton = ({ fill = '#292929', hasBackground = true, loading = false, onClick = () => { }, ...rest }) => {
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
      style={{ left: '-.7rem' }}
    >
      {hasBackground
        ?
        <IconButton2
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
        </IconButton2>
        :
        <IconButton
          className="refresh-btn-clr"
          aria-label="Refresh"
          {...rest}
        >
          <LoadingRing visible={loading} />
          <ReplayIcon fill={fill} />
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
        <Plus width={'.9em'} height={'.9em'} stroke={'currentColor'} />
      </div>
      <span />
      <span />
    </button>
  )
