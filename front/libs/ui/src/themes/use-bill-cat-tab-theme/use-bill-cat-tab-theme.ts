
import { useSchemeVar } from '../../utils/hooks/use-scheme-var/use-scheme-var';

export function useBillCatTabTheme() {
  const [mHlight, mHlightHover, mDark, sHlight, sHlightHover, sDark] = useSchemeVar([
    '--main-hlight',
    '--main-hlight-hover-darker',
    '--main-dark',
    '--secondary-hlight',
    '--secondary-hlight-hover-darker',
    '--secondary-dark'
  ])

  return [
    { pillColor: mDark, pillBackgroundColor: mHlight, tabBackgroundColor: mHlightHover, tabColor: mDark },
    { pillColor: sDark, pillBackgroundColor: sHlight, tabBackgroundColor: sHlightHover, tabColor: sDark }
  ]
}

export default useBillCatTabTheme;


// export function useBillCatTabTheme() {
//   const [pillBackGround1, pillBackGround2, pillColor1, pillColor2, tabBackgroundColor] = useSchemeVar([
//     '--main-sat',
//     '--secondary-sat',
//     '--main-hlight',
//     '--secondary-hlight',
//     '--icon-light-light-gray'
//   ])

//   return [
//     { pillColor: pillColor1, pillBackgroundColor: pillBackGround1, tabBackgroundColor },
//     { pillColor: pillColor2, pillBackgroundColor: pillBackGround2, tabBackgroundColor }
//   ]
// }

// export default useBillCatTabTheme;

