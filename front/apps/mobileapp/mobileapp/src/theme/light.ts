import { createTheme } from '@shopify/restyle';
import basePalette from './base-palette';
import { gray } from '../../../../../libs/ui/src/buttons/base';

const grayH = 240;
const grayS = 7;

const blueH = 230;
const blueS = 50;

const palette = {
  ...basePalette,
  gray100: `hsl(${grayH}, ${grayS}%, 96%)`,
  gray200: `hsl(${grayH}, ${grayS}%, 88%)`,
  gray250: `hsl(${grayH}, ${grayS}%, 86%)`,
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

  blueSat: `hsl(${blueH}, ${blueS + 10}%, 50%)`,

  offBlack: `hsl(${grayH}, ${grayS}%, 27%)`,
  offBlack2: `hsl(${grayH}, ${grayS}%, 37%)`,
  offBlack3: `hsl(${grayH}, ${grayS}%, 47%)`,
  offBlack4: `hsl(${grayH}, ${grayS}%, 57%)`,
}

export const lightTheme = createTheme({
  colors: {
    transparent: 'transparent',

    // Backgrounds
    mainBackground: palette.gray100,
    navBackground: palette.gray200,
    inputBackground: palette.gray200,

    // Borders
    inputBorder: palette.gray250,
    focusedInputBorder1: palette.blue400,
    focusedInputBorder2: palette.blue100,

    // Shadows
    navShadow: palette.gray100,

    activeIcon: palette.blueSat,

    // Text
    mainText: palette.offBlack,
    whiteText: palette.white,
    invertedText: palette.gray100,
    secondaryText: palette.offBlack3,
    tertiaryText: palette.offBlack4,
    activeText: palette.blueSat,
    placeholderText: palette.offBlack4,
    buttonLabel: palette.offBlack,

    // Buttons
    blueButton: palette.blue500,

    // Seperators
    seperator: palette.gray300,
    lightSeperator: palette.gray200,
  },
  spacing: {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 28,
    xxl: 36,
  },
  textVariants: {
    header: {
      fontSize: 32,
      lineHeight: 40,
      marginTop: 'xs',
      marginBottom: 'xs',
      fontFamily: 'SourceSans3SemiBold',
      color: 'mainText',
    },
    header2: {
      fontSize: 18,
      lineHeight: 26,
      fontFamily: 'SourceSans3Medium',
      color: 'mainText',
    },
    subheader: {
      fontSize: 32,
      lineHeight: 40,
      marginTop: 's',
      marginBottom: 's',
      fontFamily: 'SourceSans3SemiBold',
      color: 'secondaryText',
    },
    subheader2: {
      fontSize: 18,
      lineHeight: 26,
      fontFamily: 'SourceSans3Medium',
      color: 'secondaryText',
    },
    label: {
      fontSize: 16,
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
      marginLeft: 'xs',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
    },
    defaults: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
    },
  },
  buttonVariants: {
    main: {
      padding: 'm',
      borderRadius: 12,
      marginHorizontal: 'xxs',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'blueButton',
      color: 'whiteText',
    },
    socialSignIn: {
      padding: 'm',
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'seperator',
      flexDirection: 'row',
    },
    defaults: {
      padding: 's',
      alignItems: 'center',
    }
  },
  seperatorVariants: {
    s: {
      height: 1.5,
      marginVertical: 'xxl',
      backgroundColor: 'seperator',
    },
    m: {
      height: 1.5,
      marginVertical: 'xl',
      backgroundColor: 'seperator',
    },
    l: {
      height: 1.5,
      marginVertical: 'xxl',
      backgroundColor: 'seperator',
    },
  }
});

export type Theme = typeof lightTheme;
