import { useColorScheme } from "../../utils/use-color-scheme/use-color-scheme"
import './styles/light-dark-colors.scss'

export function ColorSchemedMain({ children }: { children: React.ReactNode }) {
  const { isDark } = useColorScheme()

  return (
    <main>
      {children}
    </main>
  )
}

export default ColorSchemedMain
