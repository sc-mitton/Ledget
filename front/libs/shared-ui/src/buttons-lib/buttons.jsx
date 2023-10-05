import React, { useState, forwardRef } from 'react';
import { Plus } from '@ledget/shared-assets';

import './buttons.css'
import {
  ExpandIcon,
  ArrowIcon,
  FacebookLogo,
  CloseIcon,
  GoogleLogo,
  CopyIcon,
  Delete,
  ReplayIcon,
  CheckMark
} from '@ledget/shared-assets'
import { ButtonWithClassName, withArrow, withCheckMark, withLoading } from './button-utils'
import { animated, useSpring } from '@react-spring/web'

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
export const GrnSlimButton = ButtonWithClassName('btn-grn btn-slim')
export const GrnSlimButton2 = ButtonWithClassName('btn-grn btn-2slim')
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
export const GrnSlimArrowButton = withArrow(ButtonWithClassName('btn-grn btn-slim'))
export const GreenSlimArrowSubmit = withLoading(GrnSlimArrowButton)
export const RedButton = withLoading(ButtonWithClassName('btn-red btn-2slim'))
export const GrnTextButton = ButtonWithClassName('btn-grn-text btn-2slim')
export const IconButtonSubmit = withLoading(IconButton)
export const LinkArrowButton = withArrow(ButtonWithClassName('btn-icon2'))

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

export const FacebookLoginButton = (props) => (
  <GrayWideButton
    className="btn-fb"
    {...props}
  >
    <FacebookLogo />
  </GrayWideButton>
)

export const GoogleLoginButton = (props) => (
  <GrayWideButton
    className="btn-google"
    {...props}
  >
    <GoogleLogo />
  </GrayWideButton>
)

export const CloseButton = (props) => {
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

export const BackButton = ({ withText = true, children, ...rest }) => (
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

export const PlusPill = (props) => (
  <button className="btn-chcl btn-circle btn-scale2" {...props}>
    <Plus stroke={'var(--window)'} width={'.9em'} height={'.9em'} />
  </button>
)


export const DeleteButton = ({ className, ...rest }) => (
  <button className={`btn delete-button ${className}`} {...rest}>
    <Delete width={'1.3em'} height={'1.3em'} />
  </button>
)

export const ResendButton = forwardRef((props, ref) => {
  const [rotation, setRotation] = useState(0)
  const { success, ...rest } = props

  return (
    <button
      ref={ref}
      onClick={() => setRotation(rotation + 360)}
      className="resend-btn"
      {...rest}
    >
      Resend
      <div
        className="resend-icon"
        style={{ '--key-rotation': rotation + 'deg' }}
      >
        {success
          ?
          <CheckMark
            className="resend-btn-success-icon"
            stroke={'currentColor'}
            height={'.8em'}
            width={'.8em'}
          />
          :
          <ReplayIcon fill={'currentColor'} />
        }
      </div>
    </button>
  )
})
