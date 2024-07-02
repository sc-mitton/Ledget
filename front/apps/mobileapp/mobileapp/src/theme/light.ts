import { createTheme } from '@shopify/restyle';
import basePalette from './base-palette';

const grayH = 240;
const grayS = 7;

const blueH = 230;
const blueS = 50;

const palette = {
  ...basePalette,

  red: 'hsl(0, 55%, 58%)',
  mutedRed: 'hsl(352, 98%, 76%)',
  darkRed: 'hsl(0, 59%, 34%)',

  gray100: `hsl(${grayH}, ${grayS}%, 96%)`,
  gray150: `hsl(${grayH}, ${grayS}%, 94%)`,
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
  blue450: `hsl(${blueH}, ${blueS}%, 55%)`,
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
    focusedInputBorder1: palette.blue300,
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
    blueText: palette.blue500,
    placeholderText: palette.offBlack4,
    buttonLabel: palette.offBlack,

    // Buttons
    blueButton: palette.blue500,
    blueButtonBorder: palette.blue450,
    grayButton: palette.gray200,
    grayButtonBorder: palette.gray250,

    // Seperators
    seperator: palette.gray200,
    lightSeperator: palette.gray150,
    blueseperator: palette.blue100,

    // Misc
    alert: palette.red,
  },
  spacing: {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 36,
    xxxl: 48,
  },
  textVariants: {
    header: {
      fontSize: 28,
      lineHeight: 30,
      marginTop: 'xl',
      marginBottom: 'xs',
      fontFamily: 'SourceSans3SemiBold',
      color: 'mainText',
      width: '100%',
    },
    header2: {
      fontSize: 18,
      lineHeight: 26,
      fontFamily: 'SourceSans3Medium',
      color: 'mainText',
      width: '100%',
    },
    subheader: {
      fontSize: 24,
      lineHeight: 40,
      marginTop: 's',
      marginBottom: 's',
      fontFamily: 'SourceSans3SemiBold',
      color: 'secondaryText',
      width: '100%',
    },
    subheader2: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'SourceSans3Medium',
      color: 'secondaryText',
      width: '100%',
    },
    label: {
      marginLeft: 'xs',
    },
    defaults: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
    }
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
      borderWidth: 1.5,
      borderColor: 'blueButtonBorder',
    },
    grayMain: {
      padding: 'm',
      borderRadius: 12,
      marginHorizontal: 'xxs',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'grayButton',
      color: 'mainText',
      borderWidth: 1.5,
      borderColor: 'grayButtonBorder',
    },
    borderedGrayMain: {
      padding: 'm',
      borderRadius: 12,
      marginHorizontal: 'xxs',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'seperator',
      color: 'mainText',
    },
    blueBorderedMain: {
      padding: 'm',
      borderRadius: 12,
      marginHorizontal: 'xxs',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'blueseperator',
      color: 'blueButton',
    },
    socialSignIn: {
      padding: 's',
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
      flexDirection: 'row',
      gap: 's',
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
    xl: {
      height: 1.5,
      marginVertical: 'xxxl',
      backgroundColor: 'seperator',
    },
  },
  boxVariants: {
    fullCentered: {
      flex: 1,
      justifyContent: 'center'
    },
    even: {
      flex: 1,
      justifyContent: 'space-evenly'
    },
    defaults: {}
  },
});

export type Theme = typeof lightTheme;
