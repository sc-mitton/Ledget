import React from 'react'

import './tooltip.scss'

interface Props {
  msg?: string,
  type?: 'top' | 'bottom' | 'left' | 'right',
  ariaLabel?: string,
  style?: React.CSSProperties,
  children: React.ReactNode
}

export const Tooltip = ({ msg, type = 'top', ariaLabel, children, ...rest }: Props) => {

  return (
    <div
      className="tooltip"
      aria-label={ariaLabel}
      role="tooltip"
    >
      {children}
      <span
        className={`tooltiptext ${type}`}
        {...rest}
      >
        {msg}
      </span>
    </div>
  )
}
