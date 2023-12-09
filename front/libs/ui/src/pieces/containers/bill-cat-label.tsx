
import { ElementType, PropsWithChildren, ComponentPropsWithoutRef } from 'react'
import { CheckMark } from '@ledget/media'

import './bill-cat-label.scss'

type AsProp<C extends React.ElementType> = {
  as?: C;
}

type BillCatProps<C extends ElementType> = {
  name: string
  emoji?: string | null
  color?: 'green' | 'blue'
  hoverable?: boolean
  slim?: boolean
  tint?: boolean
  checked?: boolean
  active?: boolean
} & ComponentPropsWithoutRef<C>

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, keyof (AsProp<C> & Props)>

type AllowedElements = 'div' | 'li' | 'button'

export const BillCatLabel = <C extends ElementType = 'div'>(props: PolymorphicComponentProp<AllowedElements, BillCatProps<C>>) => {
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
        <span>{emoji}</span>
        <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
      </div>
      <div>
        {checked && <CheckMark stroke={'currentColor'} size={'.75em'} />}
      </div>
      {children}
    </Component>
  )
}
