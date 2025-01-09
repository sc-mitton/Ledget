import { useSchemeVar } from '../hooks/use-scheme-var/use-scheme-var';

export function useBillCatTabTheme() {
  const [
    pillColor1,
    pillColor2,
    pillBackgroundColor1,
    pillBackgroundColor2,
    tabBackgroundColor1,
    tabBackgroundColor2,
    tabColor1,
    tabColor2,
  ] = useSchemeVar([
    '--month-color',
    '--year-color',
    '--month-background',
    '--year-background',
    '--btn-feather-light',
    '--btn-feather-light',
    '--m-text',
    '--m-text',
  ]);

  return [
    {
      pillColor: pillColor1,
      pillBackgroundColor: pillBackgroundColor1,
      tabBackgroundColor: tabBackgroundColor1,
      tabColor: tabColor1,
    },
    {
      pillColor: pillColor2,
      pillBackgroundColor: pillBackgroundColor2,
      tabBackgroundColor: tabBackgroundColor2,
      tabColor: tabColor2,
    },
  ];
}

export default useBillCatTabTheme;
