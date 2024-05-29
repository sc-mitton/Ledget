
import { Check } from '@geist-ui/icons'

import { toLower as tolower, startCase as startcase } from 'lodash-es'

import { ElementType, ComponentPropsWithoutRef, useEffect } from 'react'
import { PolymorphicComponentProps } from '../../types/helpers'

import './styles/bill-cat-label.scss'


type BillCatProps<C extends ElementType> = {
  labelName: string
  emoji?: string | null
  color?: 'blue' | 'green' | 'green-split' | 'blue-split' | 'green-blue-split'
  hoverable?: boolean
  slim?: boolean
  checked?: boolean
  active?: boolean
} & ComponentPropsWithoutRef<C>

type BillCateEmojiProps<C extends ElementType> = {
  emoji?: string | null
  color?: 'blue' | 'green' | 'green-split' | 'blue-split' | 'green-blue-split'
  hoverable?: boolean
  slim?: boolean
  checked?: boolean
  active?: boolean
  progress?: number
  size?: 'extra-small' | 'small' | 'medium'

} & ComponentPropsWithoutRef<C>

type AllowedElements = 'div' | 'li' | 'button'

export const BillCatLabel = <C extends ElementType = 'div'>(props: PolymorphicComponentProps<AllowedElements, BillCatProps<C>>) => {
  const {
    as,
    labelName,
    emoji,
    active = false,
    checked = false,
    color = 'blue',
    hoverable = true,
    slim = false,
    children,
    ...rest
  } = props
  const Component = as || 'div'

  return (
    <Component
      {...rest}
      className={`bill-cat-label
      ${color}
      ${hoverable ? 'hoverable' : ''}
      ${active ? 'active' : ''}
      ${slim ? 'slim' : ''}`
      }
    >
      <div>
        {emoji && <span>{emoji || ''}</span>}
        <span>{startcase(tolower(labelName))}</span>
      </div>
      {checked &&
        <div>
          {checked && <Check size={'1.25em'} />}
        </div>}
      {children}
    </Component>
  )
}

export const BillCatEmojiLabel = <C extends ElementType = 'div'>(props: PolymorphicComponentProps<AllowedElements, BillCateEmojiProps<C>>) => {
  const {
    as,
    emoji,
    active = false,
    checked = false,
    color = 'blue',
    hoverable = true,
    slim = false,
    progress,
    size = 'small',
    children,
    ...rest
  } = props

  const Component = as || 'div'
  const strokeWidth = 1.75
  const svgSize = size === 'small' ? 28 : 38

  return (
    <Component
      {...rest}
      className={`bill-cat-label-emoji ${color} ${hoverable ? 'hoverable' : ''} ${active ? 'active' : ''} ${!emoji ? 'empty' : ''} ${size ? size : ''}`}
    >
      {emoji && <span>{emoji || ''}</span>}
      {progress !== undefined && <div>
        <svg viewBox="0 0 36 36" style={{ width: svgSize, height: svgSize }} className={`progress-circle ${color}`}>
          <circle
            cx="18"
            cy="18"
            r="14"
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            transform="rotate(-90 18 18)"
            fill="transparent"
          />
          <circle
            cx="18"
            cy="18"
            r="14"
            strokeWidth={progress === undefined ? 0 : strokeWidth}
            fill="transparent"
            transform="rotate(-90 18 18)"
            strokeLinecap='round'
            strokeDasharray={`${progress ? parseFloat((Math.min(1, progress)).toFixed(2)) * 88 : 0}, 88`}
          />
        </svg>
      </div>}
      {children}
    </Component>
  )
}

export default BillCatLabel
