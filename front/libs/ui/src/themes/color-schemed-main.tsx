import { useColorScheme } from "./hooks/use-color-scheme/use-color-scheme"
import '../themes/styles/ledget-theme.scss'

export function ColorSchemedMain({ children }: { children: React.ReactNode }) {
  const { isDark } = useColorScheme()

  return (
    <main className={isDark ? 'dark' : 'light'}>
      {children}
    </main>
  )
}

export default ColorSchemedMain
