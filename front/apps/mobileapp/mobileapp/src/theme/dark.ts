import { createTheme } from '@shopify/restyle';
import { lightTheme } from "./light";
import basePalette from './base-palette';

const grayH = 240;
const grayS = 7;

const blueH = 226;
const blueS = 50;

const palette = {
  ...basePalette,
  gray900: `hsl(${grayH}, ${grayS}%, 5%)`,
  gray800: `hsl(${grayH}, ${grayS}%, 13%)`,
  gray700: `hsl(${grayH}, ${grayS}%, 18%)`,
  gray600: `hsl(${grayH}, ${grayS}%, 23%)`,
  gray500: `hsl(${grayH}, ${grayS}%, 28%)`,
  gray400: `hsl(${grayH}, ${grayS}%, 33%)`,
  gray300: `hsl(${grayH}, ${grayS}%, 38%)`,
  gray200: `hsl(${grayH}, ${grayS}%, 43%)`,
  gray100: `hsl(${grayH}, ${grayS}%, 48%)`,

  blue900: `hsl(${blueH}, ${blueS}%, 10%)`,
  blue800: `hsl(${blueH}, ${blueS}%, 15%)`,
  blue700: `hsl(${blueH}, ${blueS}%, 20%)`,
  blue600: `hsl(${blueH}, ${blueS}%, 25%)`,
  blue500: `hsl(${blueH}, ${blueS}%, 30%)`,
  blue400: `hsl(${blueH}, ${blueS}%, 35%)`,
  blue300: `hsl(${blueH}, ${blueS}%, 40%)`,
  blue200: `hsl(${blueH}, ${blueS}%, 45%)`,
  blue100: `hsl(${blueH}, ${blueS}%, 50%)`,

  blueSat: `hsl(${blueH}, ${blueS + 10}%, 50%)`,

  offWhite: `hsl(${grayH}, ${grayS}%, 96%)`,
  offWhite2: `hsl(${grayH}, ${grayS}%, 86%)`,
  offWhite3: `hsl(${grayH}, ${grayS}%, 76%)`,
}

export const darkTheme = createTheme({
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    mainBackground: palette.gray900,

    navBackground: palette.gray800,
    navShadow: palette.gray900,

    mainText: palette.white,
    secondaryText: palette.offWhite2,
    tertiaryText: palette.offWhite3,
    activeText: palette.blueSat,
  },
  textVariants: {
    header: {
      fontSize: 32,
      fontFamily: 'SourceSans3Medium',
      color: 'mainText',
    },
    header2: {
      fontSize: 24,
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
    }
  },
});
