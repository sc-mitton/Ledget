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
    placeholderText: palette.offWhite4,
    buttonLabel: palette.white,

    // Buttons
    blueButton: palette.blue500,

    // Seperators
    seperator: palette.gray700,
    lightSeperator: palette.gray800,
  },
  textVariants: {
    header: {
      fontSize: 32,
      lineHeight: 40,
      marginTop: 'xs',
      marginBottom: 'xs',
      fontFamily: 'SourceSans3Medium',
      color: 'mainText',
    },
    header2: {
      fontSize: 18,
      lineHeight: 26,
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
    },
    subheader: {
      fontSize: 32,
      lineHeight: 40,
      marginTop: 'xs',
      marginBottom: 'xs',
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
        borderRadius: 12,
        marginHorizontal: 'xxs',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blueButton'
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
