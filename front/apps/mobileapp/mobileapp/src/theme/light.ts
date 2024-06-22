import { createTheme } from '@shopify/restyle';
import basePalette from './base-palette';

const grayH = 240;
const grayS = 7;

const blueH = 226;
const blueS = 45;

const palette = {
  ...basePalette,
  gray100: `hsl(${grayH}, ${grayS}%, 96%)`,
  gray200: `hsl(${grayH}, ${grayS}%, 88%)`,
  gray300: `hsl(${grayH}, ${grayS}%, 80%)`,
  gray400: `hsl(${grayH}, ${grayS}%, 70%)`,
  gray500: `hsl(${grayH}, ${grayS}%, 60%)`,
  gray600: `hsl(${grayH}, ${grayS}%, 50%)`,
  gray700: `hsl(${grayH}, ${grayS}%, 40%)`,
  gray800: `hsl(${grayH}, ${grayS}%, 30%)`,
  gray900: `hsl(${grayH}, ${grayS}%, 20%)`,

  blue900: `hsl(${blueH}, ${blueS}%, 10%)`,
  blue800: `hsl(${blueH}, ${blueS}%, 20%)`,
  blue700: `hsl(${blueH}, ${blueS}%, 30%)`,
  blue600: `hsl(${blueH}, ${blueS}%, 40%)`,
  blue500: `hsl(${blueH}, ${blueS}%, 50%)`,
  blue400: `hsl(${blueH}, ${blueS}%, 60%)`,
  blue300: `hsl(${blueH}, ${blueS}%, 70%)`,
  blue200: `hsl(${blueH}, ${blueS}%, 80%)`,
  blue100: `hsl(${blueH}, ${blueS}%, 90%)`,

  offBlack: `hsl(${grayH}, ${grayS}%, 27%)`,
}

export const lightTheme = createTheme({
  colors: {
    mainBackground: palette.gray100,
    text: palette.offBlack,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontWeight: 'bold',
      fontSize: 34,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    defaults: {
    },
  },
});
