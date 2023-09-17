import React, { forwardRef, useRef } from 'react';

import './buttons.css'
import { ExpandIcon, ArrowIcon, FacebookLogo, CloseIcon, GoogleLogo, CopyIcon } from '@ledget/shared-assets'
import { ButtonWithClassName, withArrow, withCheckMark, withLoadingRing } from './button-utils'
import { animated, useSpring } from '@react-spring/web'

export const BlackPillButton = ButtonWithClassName('btn-chcl btn-pill')
export const BlackPrimaryButton = ButtonWithClassName('btn-chcl btn3')
export const SecondaryButton = ButtonWithClassName('btn3 btn-scale btn-scale btn-second')
export const GrnPrimaryButton = ButtonWithClassName('btn-grn btn3')
export const GrayButton = ButtonWithClassName('btn-gr3 btn-slim')

export const BlackWideButton = ButtonWithClassName('btn-chcl btn-wide')
export const GrnWideButton = ButtonWithClassName('btn-grn btn-wide')
export const GrayWideButton = ButtonWithClassName('btn-gr btn-wide')

export const BlackSlimButton = ButtonWithClassName('btn-chcl btn-slim')
export const GrnSlimButton = ButtonWithClassName('btn-grn btn-slim')
export const SlimButton = ButtonWithClassName('btn-clr btn-2slim')
export const NarrowButton = ButtonWithClassName('btn-clr btn-narrow')
export const IconButton = ButtonWithClassName('btn-clr btn-icon')
export const IconButton2 = ButtonWithClassName('btn-gr2 btn-icon2')
export const IconScaleButton = ButtonWithClassName('btn-scale2 btn-transparent')
export const InputButton = ButtonWithClassName('btn-input btn-input-full')
export const SlimInputButton = ButtonWithClassName('btn-input2 btn-2slim')

// Specialised Buttons
export const BlackPillButtonWithArrow = withArrow(BlackPillButton)
export const BlackPrimaryButtonWithArrow = withArrow(BlackPrimaryButton)
export const BlackSubmitWithArrow = withLoadingRing(withArrow(BlackPrimaryButton))
export const GreenSubmitWithArrow = withLoadingRing(withArrow(GrnPrimaryButton))
export const GreenSubmitButton = withLoadingRing(GrnPrimaryButton)
export const GreenCheckSubmitButton = withCheckMark(GreenSubmitButton)
export const GrnSlimArrowButton = withArrow(ButtonWithClassName('btn-grn btn-slim'))
export const GreenSlimArrowSubmit = withLoadingRing(GrnSlimArrowButton)
export const RedButton = withLoadingRing(ButtonWithClassName('btn-red btn-2slim'))
export const GrnTextButton = ButtonWithClassName('btn-grn-text btn-2slim')

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

export const CloseButton = (props, ref) => {
  const localRef = useRef(null)
  const { style, ...rest } = props

  return (
    <button
      className="btn-clr btn btn-icon"
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
}

export const BackButton = (props) => {
  return (
    <div>
      <button className="btn btn-2slim back-btn" {...props}>
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
        <span>back</span>
      </button>
    </div>
  )
}

export const CopyButton = (props) => {
  const { withText = true, onClick, ...rest } = props
  const [springProps, copyBtnApi] = useSpring(() => ({
    from: { transform: 'scale(1)' }
  }))

  const handleClick = () => {
    copyBtnApi.start({
      to: async (next, cancel) => {
        await next({ transform: 'scale(1)' })
        await next({ transform: 'scale(0.9)' })
        await next({ transform: 'scale(1)' })
      },
      config: { duration: 150 }
    })
    onClick()
  }

  return (
    <animated.div style={springProps}>
      <SlimInputButton
        onClick={() => {
          handleClick()
          onClick()
        }}
        {...rest}
      >
        <CopyIcon />
        {withText && 'Copy'}
      </SlimInputButton>
    </animated.div>
  )
}
