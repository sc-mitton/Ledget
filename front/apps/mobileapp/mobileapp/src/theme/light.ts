import { createTheme } from '@shopify/restyle';
import basePalette from './base-palette';
import { gray } from '../../../../../libs/ui/src/buttons/base';

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
  blue800: `hsl(${blueH}, ${blueS}%, 15%)`,
  blue700: `hsl(${blueH}, ${blueS}%, 25%)`,
  blue600: `hsl(${blueH}, ${blueS}%, 30%)`,
  blue500: `hsl(${blueH}, ${blueS}%, 35%)`,
  blue400: `hsl(${blueH}, ${blueS}%, 40%)`,
  blue300: `hsl(${blueH}, ${blueS}%, 45%)`,
  blue200: `hsl(${blueH}, ${blueS}%, 50%)`,
  blue100: `hsl(${blueH}, ${blueS}%, 55%)`,

  blueSat: `hsl(${blueH}, ${blueS + 10}%, 50%)`,

  offBlack: `hsl(${grayH}, ${grayS}%, 27%)`,
  offBlack2: `hsl(${grayH}, ${grayS}%, 35%)`,
  offBlack3: `hsl(${grayH}, ${grayS}%, 43%)`,
}

export const lightTheme = createTheme({
  colors: {
    mainBackground: palette.gray100,
    navBackground: palette.gray200,
    navShadow: palette.gray100,

    // Text
    mainText: palette.offBlack,
    secondaryText: palette.offBlack2,
    tertiaryText: palette.offBlack3,

    activeText: palette.blueSat,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontSize: 32,
      fontFamily: 'SourceSans3SemiBold',
      color: 'mainText',
    },
    header2: {
      fontSize: 24,
      fontFamily: 'SourceSans3Medium',
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

export type Theme = typeof lightTheme;
