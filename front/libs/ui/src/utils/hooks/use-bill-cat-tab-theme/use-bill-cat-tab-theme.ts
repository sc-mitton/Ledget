
import { useSchemeVar } from '../use-scheme-var/use-scheme-var';

export function useBillCatTabTheme() {
  const [mHlight, mHlightHover, mDark, sHlight, sHlightHover, sDark] = useSchemeVar([
    '--main-hlight',
    '--main-hlight-hover',
    '--main-dark4',
    '--secondary-hlight',
    '--secondary-hlight-hover',
    '--secondary-dark4'
  ])

  return [
    { pillColor: mDark, pillBackgroundColor: mHlightHover, tabBackgroundColor: mHlight, tabColor: mDark },
    { pillColor: sDark, pillBackgroundColor: sHlightHover, tabBackgroundColor: sHlight, tabColor: sDark }
  ]
}

export default useBillCatTabTheme;
