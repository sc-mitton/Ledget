
import { useSchemeVar } from '../../utils/hooks/use-scheme-var/use-scheme-var';

export function useBillCatTabTheme() {
  const [
    pillColor1, pillColor2,
    pillBackgroundColor1, pillBackgroundColor2,
    tabBackgroundColor1, tabBackgroundColor2,
    tabColor1, tabColor2] = useSchemeVar([
      '--monthly-color',
      '--yearly-color',
      '--monthly-background-color',
      '--yearly-background-color',
      '--btn-light-gray',
      '--btn-light-gray',
      '--btn-gray',
      '--btn-gray'
    ])

  return [
    {
      pillColor: pillColor1,
      pillBackgroundColor: pillBackgroundColor1,
      tabBackgroundColor: tabBackgroundColor1,
      tabColor: tabColor1
    },
    {
      pillColor: pillColor2,
      pillBackgroundColor: pillBackgroundColor2,
      tabBackgroundColor: tabBackgroundColor2,
      tabColor: tabColor2
    }
  ]
}

export default useBillCatTabTheme;
