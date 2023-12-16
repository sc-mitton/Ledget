
import { useColorScheme } from "../../utils/use-color-scheme/use-color-scheme"
import './styles/light-dark-colors.scss'

export function ColorSchemedMain({ children }: { children: React.ReactNode }) {
  const { isDark } = useColorScheme()

  return (
    <>
      {isDark
        ? <main className="dark">{children}</main>
        : <main className="light">{children}</main>}
    </>
  )
}

export default ColorSchemedMain
