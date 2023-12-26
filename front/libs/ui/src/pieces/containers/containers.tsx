import React, { ComponentPropsWithoutRef, ElementType, FC, useRef, HTMLProps, useEffect, forwardRef } from 'react'
import { PolymorphicComponentProps } from '../../types/helpers'
import './styles/containers.scss'
import { H } from 'vitest/dist/types-198fd1d9'

export const ExpandableContainer: FC<HTMLProps<HTMLDivElement> & { expanded?: boolean }>
  = ({ expanded = true, className = '', children, ...rest }) => (
    <div className={`animated-container ${expanded ? 'expanded' : 'collapsed'} ${className}`} {...rest}>
      {children}
    </div>
  )


export const InfiniteScrollDiv = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & { animate?: boolean }>(({
  children,
  className,
  animate = false,
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

export const ShadowScrollDiv = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ children, style, ...rest }, parentRef) => {
    const [shadow, setShadow] = React.useState<'top' | 'bottom' | 'bottom-top' | ''>('')
    const localRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const handleScroll = (e: Event) => {
        if (localRef.current) {
          const { scrollTop, scrollHeight, offsetHeight } = e.target as HTMLDivElement;
          // Update shadow based on scroll position
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

      localRef.current?.addEventListener('scroll', handleScroll)

      return () => {
        localRef.current?.removeEventListener('scroll', handleScroll)
      }
    }, [])

    return (
      <div
        {...rest}
        style={{ maskImage: getMaskImage(shadow), ...style }}
        ref={(el) => {
          localRef.current = el
          if (typeof parentRef === 'function') {
            parentRef(el)
          } else if (parentRef && 'current' in parentRef) {
            (parentRef as React.MutableRefObject<HTMLDivElement | null>).current = el
          }
        }}
      >
        {children}
      </div>
    )
  }
)

export const GrowOnDiv = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>
  & { immediate: boolean }>(({
    children,
    immediate = false,
    className,
    ...rest
  }, ref) => (
    <div className={`${className} grow-on--container${immediate ? '-immediate' : ''}`} {...rest} ref={ref}>
      {children}
    </div>
  ))

type DropdownItemProps<C extends ElementType> = {
  active?: boolean
  selected?: boolean
} & ComponentPropsWithoutRef<C>

export const DropdownItem = <C extends ElementType = 'div'>
  (props: PolymorphicComponentProps<'li' | 'div' | 'button', DropdownItemProps<C>>) => {

  const { children, active, selected, className, as, ...rest } = props
  const Component = as || 'div'

  return (
    <Component
      {...rest}
      className={`
        ${className} dropdown-item
        ${active ? "active" : ''}
        ${selected ? "selected" : ''}`}
    >
      {children}
    </Component>
  )
}
