import React, { HTMLProps, forwardRef } from 'react'
import './containers.scss'

export const ExpandableContainer = ({ expanded = true, className = '', children, ...rest }: {
  expanded?: boolean,
  className?: string,
  children: React.ReactNode
}) => (
  <div className={`animated-container ${expanded ? 'expanded' : 'collapsed'} ${className}`} {...rest}>
    {children}
  </div>
)


export const InfiniteScrollDiv = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & { animate: boolean }>(({
  children,
  className,
  animate,
  ...rest
}, ref) => (
  <div className={`infinite-scroll--container ${className ? className : ''} ${animate ? 'fetching-more' : ''}`} {...rest} ref={ref}>
    {children}
  </div>
))
