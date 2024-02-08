import { HTMLProps } from 'react'

import { useColorScheme } from "./hooks/use-color-scheme/use-color-scheme"
import '../themes/styles/ledget-theme.scss'

type Props = HTMLProps<HTMLDivElement>

export function ColorSchemedDiv({ children, className, ...rest }: Props) {
  const { isDark } = useColorScheme()

  return (
    <div className={`${className} ${isDark ? 'dark' : 'light'}`} {...rest}>
      {children}
    </div>
  )
}

export default ColorSchemedDiv
