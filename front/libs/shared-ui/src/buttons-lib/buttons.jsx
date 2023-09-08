import React, { forwardRef, useRef } from 'react';

import './buttons.css'
import { ExpandIcon, ArrowIcon, FacebookLogo, CloseIcon, GoogleLogo } from '@ledget/shared-assets'
import { ButtonWithClassName, withArrow, withCheckMark, withLoadingRing } from './button-utils'

export const BlackPillButton = ButtonWithClassName('btn-chcl btn-pill')
export const BlackPrimaryButton = ButtonWithClassName('btn-chcl btn3')
export const SecondaryButton = ButtonWithClassName('btn3 btn-scale btn-scale btn-second')
export const GrnPrimaryButton = ButtonWithClassName('btn-grn btn3')

export const BlackWideButton = ButtonWithClassName('btn-chcl btn-wide')
export const GrnWideButton = ButtonWithClassName('btn-grn btn-wide')
export const GrayWideButton = ButtonWithClassName('btn-gr btn-wide')

export const BlackSlimButton = ButtonWithClassName('btn-chcl btn-slim')
export const GrnSlimButton = ButtonWithClassName('btn-grn btn-slim')
export const SlimButton = ButtonWithClassName('btn-clr btn-2slim')
export const RedButton = ButtonWithClassName('btn-red')
export const NarrowButton = ButtonWithClassName('btn-clr btn-narrow')
export const IconButton = ButtonWithClassName('btn-clr btn-icon')
export const IconButton2 = ButtonWithClassName('btn-gr2 btn-icon2')
export const InputButton = ButtonWithClassName('btn-input btn-input-full')
export const SlimInputButton = ButtonWithClassName('btn-input2 btn-2slim')

// Specialised Buttons
export const BlackPillButtonWithArrow = withArrow(BlackPillButton)
export const BlackPrimaryButtonWithArrow = withArrow(BlackPrimaryButton)
export const BlackSubmitWithArrow = withLoadingRing(withArrow(BlackPrimaryButton))
export const GreenSubmitButton = withLoadingRing(GrnPrimaryButton)
export const GreenCheckSubmitButton = withCheckMark(GreenSubmitButton)

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
      className="btn-clr btn btn-icon"
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
