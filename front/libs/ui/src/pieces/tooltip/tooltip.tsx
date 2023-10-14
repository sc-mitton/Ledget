import React from 'react'

import './tooltip.css'

interface Props {
  msg?: string,
  type?: 'top' | 'bottom' | 'left' | 'right',
  ariaLabel?: string,
  style?: React.CSSProperties,
  children: React.ReactNode
}

const Tooltip = ({ msg, type = 'top', ariaLabel, style, children, ...rest }: Props) => {

  return (
    <div
      className="tooltip"
      aria-label={ariaLabel}
      role="tooltip"
    >
      {children}
      <span
        style={style}
        className={`tooltiptext ${type}`}
        {...rest}
      >
        {msg}
      </span>
    </div>
  )
}

export default Tooltip
