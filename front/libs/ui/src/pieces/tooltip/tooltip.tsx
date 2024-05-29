import React from 'react'

import './tooltip.scss'

interface Props {
  msg?: string,
  type?: 'top' | 'bottom' | 'left' | 'right',
  ariaLabel?: string,
  delay?: number,
  style?: React.CSSProperties,
  children: React.ReactNode
}

export const Tooltip = ({ msg, ariaLabel, children, type = 'top', delay = 1.2, ...rest }: Props) => {

  return (
    <div
      className="tooltip"
      aria-label={ariaLabel}
    >
      {children}
      <span
        className={`tooltiptext ${type}`}
        role="tooltip"
        style={{ '--delay': `${delay}s` } as React.CSSProperties}
        {...rest}
      >
        {msg}
      </span>
    </div>
  )
}
