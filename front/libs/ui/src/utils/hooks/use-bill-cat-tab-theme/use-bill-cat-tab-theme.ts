
import { useSchemeVar } from '../use-scheme-var/use-scheme-var';

export function useBillCatTabTheme() {
  const [mHlight, mHlightHover, mDark, sHlight, sHlightHover, sDark] = useSchemeVar([
    '--main-hlight',
    '--main-hlight-hover',
    '--main-dark',
    '--secondary-hlight',
    '--secondary-hlight-hover',
    '--secondary-dark'
  ])

  return [
    { pillColor: mDark, pillBackgroundColor: mHlight, tabBackgroundColor: mHlightHover, tabColor: mDark },
    { pillColor: sDark, pillBackgroundColor: sHlight, tabBackgroundColor: sHlightHover, tabColor: sDark }
  ]
}

export default useBillCatTabTheme;
