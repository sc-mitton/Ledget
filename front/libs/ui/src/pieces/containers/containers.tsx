import React, { FC, HTMLProps, useEffect, forwardRef } from 'react'
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

const getMaskImage = (string: 'top' | 'bottom' | 'bottom-top' | '') => {
  switch (string) {
    case 'top':
      return 'linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 0px), transparent)'
    case 'bottom':
      return 'linear-gradient(to bottom, transparent 0%, black 0px, black calc(100% - 16px), transparent)'
    case 'bottom-top':
      return 'linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 16px), transparent)'
    default:
      return ''
  }
}

// export const ScrollDiv = <HTMLDivElement, HTMLProps<HTMLDivElement> & { animate: boolean }>(({
export const ShadowScrollDiv: FC<HTMLProps<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  const [shadow, setShadow] = React.useState<'top' | 'bottom' | 'bottom-top' | ''>('')
  const ref = React.useRef<HTMLDivElement>(null)

  // Scroll shadow effects
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (ref.current && ref.current) {
        const { scrollTop, scrollHeight, offsetHeight } = ref.current
        if (scrollTop === 0 && scrollHeight === offsetHeight) {
          setShadow('')
        } else if (scrollTop === 0 && scrollHeight > offsetHeight) {
          setShadow('bottom')
        } else if (scrollTop > 0 && scrollTop + offsetHeight < scrollHeight) {
          setShadow('bottom-top')
        } else if (scrollTop + offsetHeight === scrollHeight) {
          setShadow('top')
        }
      }
    }, 50)

    const handleScroll = (e: Event) => {
      if (ref.current && ref.current) {
        const { scrollTop, scrollHeight, offsetHeight } = e.target as HTMLDivElement
        if (scrollTop === 0 && scrollHeight === offsetHeight) {
          setShadow('')
        } else if (scrollTop === 0 && scrollHeight > offsetHeight) {
          setShadow('bottom')
        } else if (scrollTop > 0 && scrollTop + offsetHeight < scrollHeight) {
          setShadow('bottom-top')
        } else if (scrollTop + offsetHeight === scrollHeight) {
          setShadow('top')
        }
      }
    }
    ref.current?.addEventListener('scroll', handleScroll)
    return () => {
      ref.current?.removeEventListener('scroll', handleScroll)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div
      {...rest}
      style={{ maskImage: getMaskImage(shadow) }}
      ref={ref}
    >
      {children}
    </div>
  )
}
