import { createTheme } from '@shopify/restyle';
import { lightTheme } from "./light";
import basePalette from './base-palette';

const grayH = 240;
const grayS = 7;

const blueH = 226;
const blueS = 50;

const palette = {
  ...basePalette,

  mutedRed: 'hsl(352, 98%, 90%)',
  red: 'hsl(352, 86%, 69%)',
  darkRed: 'hsl(0, 59%, 34%)',
  successGreen: 'hsl(144, 72%, 43%)',

  gray900: `hsl(${grayH}, ${grayS}%, 5%)`,
  gray850: `hsl(${grayH}, ${grayS}%, 9%)`,
  gray800: `hsl(${grayH}, ${grayS}%, 13%)`,
  gray750: `hsl(${grayH}, ${grayS}%, 15%)`,
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
  offWhite2: `hsl(${grayH}, ${grayS}%, 80%)`,
  offWhite3: `hsl(${grayH}, ${grayS}%, 70%)`,
  offWhite4: `hsl(${grayH}, ${grayS}%, 60%)`,
}

export const darkTheme = createTheme({
  ...lightTheme,
  colors: {
    ...lightTheme.colors,

    // Backgrounds
    mainBackground: palette.gray900,
    navBackground: palette.gray850,
    inputBackground: palette.gray800,

    // Borders
    inputBorder: palette.gray750,
    focusedInputBorder1: palette.blue400,
    focusedInputBorder2: palette.blue800,

    // Shadows
    navShadow: palette.gray900,

    activeIcon: palette.blueSat,

    // Text
    mainText: palette.offWhite,
    invertedText: palette.gray900,
    whiteText: palette.offWhite,
    secondaryText: palette.offWhite3,
    tertiaryText: palette.offWhite4,
    activeText: palette.blueSat,
    focusedText: palette.blueSat,
    blueText: palette.blue200,
    placeholderText: palette.offWhite4,
    buttonLabel: palette.white,

    // Buttons
    blueButton: palette.blue500,
    blueButtonBorder: palette.blue400,
    grayButton: palette.gray800,
    grayButtonBorder: palette.gray750,

    // Seperators
    seperator: palette.gray700,
    lightSeperator: palette.gray800,
    blueseperator: palette.blue400,

    // Misc
    alert: palette.red,
    pulseWaiting: palette.gray800,
    pulseSuccess: palette.successGreen,
  },
  textVariants: {
    header: {
      fontSize: 28,
      lineHeight: 40,
      marginTop: 'xs',
      marginBottom: 'xs',
      fontFamily: 'SourceSans3Medium',
      color: 'mainText',
      width: '100%',
    },
    header2: {
      fontSize: 18,
      lineHeight: 26,
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
      width: '100%',
    },
    subheader: {
      fontSize: 32,
      lineHeight: 40,
      marginTop: 'xs',
      marginBottom: 'xs',
      fontFamily: 'SourceSans3SemiBold',
      color: 'secondaryText',
      width: '100%',
    },
    subheader2: {
      fontSize: 18,
      lineHeight: 24,
      fontFamily: 'SourceSans3Regular',
      color: 'secondaryText',
      width: '100%',
    },
    subheader3: {
      fontSize: 16,
      lineHeight: 20,
      fontFamily: 'SourceSans3Regular',
      color: 'secondaryText',
      width: '100%',
    },
    label: {
      fontSize: 16,
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
      marginLeft: 'xs',
    },
    defaults: {
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
      fontSize: 16,
      lineHeight: 24,
    },
    buttonVariants: {
      main: {
        paddingTop: 'm',
        paddingBottom: 'm',
        marginVerticle: 'xs',
        borderRadius: 12,
        marginHorizontal: 'xxs',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blueButton',
        borderWidth: 1.5,
        borderColor: 'blueButtonBorder',
      },
      grayMain: {
        paddingTop: 'm',
        paddingBottom: 'm',
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
        paddingTop: 'm',
        paddingBottom: 'm',
        borderRadius: 12,
        marginHorizontal: 'xxs',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'grayButtonBorder',
        color: 'secondaryText',
      },
      blueBorderedMain: {
        paddingTop: 'm',
        paddingBottom: 'm',
        borderRadius: 12,
        marginHorizontal: 'xxs',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'blueseperator',
      },
      socialSignIn: {
        padding: 's',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'seperator',
        flexDirection: 'row',
      }
    },
    seperatorVariants: {
      s: {
        height: 1.5,
        marginVertical: 'l',
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
  }
});
