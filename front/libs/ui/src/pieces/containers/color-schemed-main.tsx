import { useColorScheme } from "../../utils/hooks/use-color-scheme/use-color-scheme"
import './styles/light-dark-colors.scss'

export function ColorSchemedMain({ children }: { children: React.ReactNode }) {
  const { isDark } = useColorScheme()

  return (
    <main className={isDark ? 'dark' : 'light'}>
      {children}
    </main>
  )
}

export default ColorSchemedMain
