import { PropsWithChildren, ElementType } from 'react'


type AsProp<C extends ElementType> = {
    as?: C
}

export type PolymorphicComponentProps<
    C extends React.ElementType,
    Props = {}
> = PropsWithChildren<Props & AsProp<C>> &
    Omit<ComponentPropsWithoutRef<C>, keyof (AsProp<C> & Props)>
