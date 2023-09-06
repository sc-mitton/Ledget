import React from 'react';

import './buttons.css'
import Arrow from '../assets/Arrow'

export const withArrow = (Component) => {

  return (props) => {
    const { children, className, disabledHover, stroke, ...rest } = props

    return (
      <Component
        className={`scale-icon-btn ${className} ${disabledHover ? 'disabled-hover' : ''}`}
        {...rest}
      >
        {children}
        <Arrow
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

const BaseButton = (props) => {
  const { className, children, ...rest } = props

  return (
    <button className={`btn ${className}`} {...rest}>
      {children}
    </button>
  )
}

const ButtonWithClassName = (className) => ({ children, ...rest }) => (
  <BaseButton className={className} {...rest}>
    {children}
  </BaseButton>
)

export const BlackPillButton = ButtonWithClassName('btn-pill')
export const BlackPrimaryButton = ButtonWithClassName('btn3')
export const GrnPrimaryButton = ButtonWithClassName('btn-grn')
export const SecondaryButton = ButtonWithClassName('btn3')
