import React from 'react'

import styles from './tooltip.module.scss'

interface Props {
  msg?: string,
  type?: 'top' | 'bottom' | 'left' | 'right',
  ariaLabel?: string,
  delay?: number,
  style?: React.CSSProperties,
  children: React.ReactNode
  className?: string
}

export const Tooltip = ({ msg, ariaLabel, className, children, type = 'top', delay = 1.2, ...rest }: Props) => {

  return (
    <div
      className={[styles.tooltip, className].join(' ')}
      aria-label={ariaLabel}
    >
      {children}
      <span
        className={styles.tooltipText}
        data-type={type}
        role="tooltip"
        style={{ '--delay': `${delay}s` } as React.CSSProperties}
        {...rest}
      >
        {msg}
      </span>
    </div>
  )
}
