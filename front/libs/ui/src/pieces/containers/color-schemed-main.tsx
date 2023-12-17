import { useEffect } from "react"
import { useColorScheme } from "../../utils/use-color-scheme/use-color-scheme"
import './styles/light-dark-colors.scss'

export function ColorSchemedMain({ children }: { children: React.ReactNode }) {
  const { isDark } = useColorScheme()

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [isDark])

  return (
    <main>
      {children}
    </main>
  )
}

export default ColorSchemedMain
