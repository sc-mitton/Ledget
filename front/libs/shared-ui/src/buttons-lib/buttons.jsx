import React, { forwardRef, useRef } from 'react';

import './buttons.css'
import { ExpandIcon, ArrowIcon, FacebookLogo, CloseIcon, GoogleLogo } from '@ledget/shared-assets'
import { LoadingRing } from '../pieces-lib/pieces'

const BaseButton = forwardRef((props, ref) => {
  const { className, children, ...rest } = props
  const localRef = useRef(null)
  const r = ref || localRef

  return (
    <button ref={r} className={`btn ${className}`} {...rest}>
      {children}
    </button>
  )
})

const ButtonWithClassName = (className) => forwardRef((props, ref) => {
  const { children, className: classNameInner, ...rest } = props
  const localRef = useRef(null)
  const r = ref || localRef

  return (
    <BaseButton ref={r} className={`${className} ${classNameInner ? classNameInner : ''}`} {...rest}>
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

export const withLoadingRing = (Component) => {
  return (props) => {
    const { children, submitting, ...rest } = props

    return (
      <LoadingRing loading={submitting}>
        <Component disableHover={submitting} {...rest}>
          {children}
        </Component>
      </LoadingRing>
    )
  }
}

export const BlackPillButton = ButtonWithClassName('btn-chcl btn-pill')
export const BlackPrimaryButton = ButtonWithClassName('btn-chcl btn3')
export const SecondaryButton = ButtonWithClassName('btn3 btn-scale btn-scale')
export const GrnPrimaryButton = ButtonWithClassName('btn-grn btn3')

export const BlackWideButton = ButtonWithClassName('btn-chcl btn-wide')
export const GrnWideButton = ButtonWithClassName('btn-grn btn-wide')
export const GrayWideButton = ButtonWithClassName('btn-gr btn-wide')

export const BlackSlimButton = ButtonWithClassName('btn-chcl btn-slim')
export const GrnSlimButton = ButtonWithClassName('btn-grn btn-slim')
export const SlimButton = ButtonWithClassName('btn-clr btn-2slim')
export const NarrowButton = ButtonWithClassName('btn-clr btn-narrow')
export const IconButton = ButtonWithClassName('btn-clr btn-icon')
export const IconButton2 = ButtonWithClassName('btn-gr2 btn-icon')
export const InputButton = ButtonWithClassName('btn-input')

// Specialised Buttons
export const BlackPillButtonWithArrow = withArrow(BlackPillButton)
export const BlackPrimaryButtonWithArrow = withArrow(BlackPrimaryButton)
export const BlackSubmitWithArrow = withLoadingRing(withArrow(BlackPrimaryButton))
export const GreenSubmitButton = withLoadingRing(GrnPrimaryButton)

export const SmallArrowButton = ({ type, ...rest }) => (
  <button className="arrow-nav btn-scale2" {...rest}>
    <ArrowIcon stroke='var(--m-text-gray)' scale={.8} rotation={type === "back" ? 90 : -90} />
  </button>
)

export const ExpandButton = ({ onClick, flipped, ...rest }) => (
  <button
    className={`btn-sp btn-discreet expand-button `}
    id="expand-button"
    tabIndex={0}
    onClick={() => onClick()}
    aria-label="Expand"
    {...rest}
  >
    <div className={`expand-button--icon ${flipped ? 'flipped' : ''} `}>
      <ExpandIcon stroke={"var(--faded-text)"} />
    </div >
  </button>
)

export const FacebookLoginButton = ({ props }) => (
  <GrayWideButton
    className="btn-fb"
    {...props}
  >
    <FacebookLogo />
  </GrayWideButton>
)

export const GoogleLoginButton = ({ props }) => (
  <GrayWideButton
    className="btn-google"
    {...props}
  >
    <GoogleLogo />
  </GrayWideButton>
)

export const CloseButton = forwardRef((props, ref) => {
  const localRef = useRef(null)
  const r = ref || localRef
  const { style, ...rest } = props

  return (
    <button
      className="btn-clr btn"
      ref={r}
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        ...style,
      }}
      {...rest}
    >
      <CloseIcon />
    </button>
  )
})
