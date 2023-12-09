import { ElementType, PropsWithChildren, ComponentPropsWithoutRef, ComponentPropsWithRef, forwardRef } from 'react'

import { CheckMark } from '@ledget/media';

import './bill-cat-label.scss'

type AsProp<C extends React.ElementType> = {
  as?: C;
}

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, keyof (AsProp<C> & Props)>

type BillCatLabelProps<C extends ElementType> = PolymorphicComponentProp<C, {
  name: string
  emoji?: string | null
  color?: 'green' | 'blue'
  hoverable?: boolean
  slim?: boolean
  tint?: boolean
  checked?: boolean
  active?: boolean
}>

type AllowedElements = 'div' | 'li' | 'button'

export const BillCatLabel = <C extends ElementType = 'div'>(
  props: BillCatLabelProps<C>,
) => {
  const {
    as,
    name,
    emoji,
    tint = false,
    active = false,
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
        {props.checked && <CheckMark stroke={'currentColor'} />}
      </div>
      {children}
    </Component>
  )
}
