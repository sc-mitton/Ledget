import { useMemo } from 'react'
import { useColorScheme } from '../use-color-scheme/use-color-scheme'

type CSSVar = `--${string}`
type ReturnType<T> = T extends CSSVar[] ? string[] : string | undefined

export function useSchemeVar<T extends CSSVar[] | CSSVar>(variable: T): ReturnType<T> {
  const { isDark } = useColorScheme()

  const main = document.querySelector('main')
  if (!main) return undefined as any

  if (Array.isArray(variable)) {
    return variable.map((v) => getComputedStyle(main).getPropertyValue(v)) as any
  } else {
    return getComputedStyle(main).getPropertyValue(variable) as any
  }

}

export default useSchemeVar
