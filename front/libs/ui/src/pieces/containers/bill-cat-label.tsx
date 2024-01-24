
import { Check } from '@geist-ui/icons'

import { ElementType, ComponentPropsWithoutRef } from 'react'
import { PolymorphicComponentProps } from '../../types/helpers'

import './styles/bill-cat-label.scss'


type BillCatProps<C extends ElementType> = {
  name: string
  emoji?: string | null
  color?: 'blue' | 'green' | 'green-split' | 'blue-split' | 'green-blue-split'
  hoverable?: boolean
  slim?: boolean
  tint?: boolean
  checked?: boolean
  active?: boolean
} & ComponentPropsWithoutRef<C>

type AllowedElements = 'div' | 'li' | 'button'

export const BillCatLabel = <C extends ElementType = 'div'>(props: PolymorphicComponentProps<AllowedElements, BillCatProps<C>>) => {
  const {
    as,
    name,
    emoji,
    tint = false,
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
      ${tint ? 'tint' : ''}
      ${active ? 'active' : ''}
      ${slim ? 'slim' : ''}`
      }
    >
      <div>
        {emoji && <span>{emoji || ''}</span>}
        <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
      </div>
      {checked &&
        <div>
          {checked && <Check size={'1.25em'} />}
        </div>}
      {children}
    </Component>
  )
}

export default BillCatLabel
