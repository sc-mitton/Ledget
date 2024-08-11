import { createTheme } from '@shopify/restyle';
import basePalette from './base-palette';

const grayH = 240;
const grayS = 7;

const blueH = 230;
const blueS = 50;

const palette = {
  ...basePalette,

  red: 'hsl(0, 55%, 68%)',
  mutedRed: 'hsl(352, 98%, 86%)',
  darkRed: 'hsl(0, 59%, 34%)',
  successGreen: 'hsl(144, 62%, 53%)',
  successGreenFaint: 'hsl(144, 62%, 83%)',

  gray100: `hsl(${grayH}, ${grayS}%, 98%)`,
  gray150: `hsl(${grayH}, ${grayS}%, 96%)`,
  gray200: `hsl(${grayH}, ${grayS}%, 92%)`,
  gray250: `hsl(${grayH}, ${grayS}%, 90%)`,
  gray275: `hsl(${grayH}, ${grayS}%, 89%)`,
  gray300: `hsl(${grayH}, ${grayS}%, 87%)`,
  gray400: `hsl(${grayH}, ${grayS}%, 82%)`,
  gray500: `hsl(${grayH}, ${grayS}%, 77%)`,
  gray600: `hsl(${grayH}, ${grayS}%, 72%)`,
  gray700: `hsl(${grayH}, ${grayS}%, 67%)`,
  gray800: `hsl(${grayH}, ${grayS}%, 62%)`,
  gray900: `hsl(${grayH}, ${grayS}%, 57%)`,
  gray1000: `hsl(${grayH}, ${grayS}%, 52%)`,

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

  black: 'hsl(0, 0%, 0%)',
  offBlack: `hsl(${grayH}, ${grayS}%, 25%)`,
  offBlack2: `hsl(${grayH}, ${grayS}%, 42%)`,
  offBlack3: `hsl(${grayH}, ${grayS}%, 60%)`,
  offBlack4: `hsl(${grayH}, ${grayS}%, 70%)`,
  offBlack5: `hsl(${grayH}, ${grayS}%, 80%)`,
  offBlack6: `hsl(${grayH}, ${grayS}%, 90%)`,
}

export const lightTheme = createTheme({
  colors: {
    transparent: 'transparent',
    mode: 'light',

    // Backgrounds
    mainBackground: palette.gray150,
    accountsMainBackground: palette.gray100,
    androidbottomNavBackground: palette.gray200,
    bottomNavBackground: palette.gray500,
    inputBackground: palette.gray200,
    nestedContainer: palette.white,
    avatar: palette.gray500,
    modalOverlay: palette.gray400,
    modalBox: palette.gray100,

    // Borders
    inputBorder: palette.gray250,
    inputBorderErrorSecondary: palette.mutedRed,
    inputBorderErrorMain: palette.red,
    focusedInputBorderSecondary: palette.blue100,
    focusedInputBorderMain: palette.blue300,
    tabNavPillBorder: palette.blue500,
    bottomNavBorder: palette.gray500,
    nestedContainerBorder: `hsl(${grayH}, ${grayS}%, 95%)`,
    tabNavBorder: palette.gray250,

    // Shadows
    navShadow: palette.gray300,
    tabsShadow: palette.gray300,
    activeIcon: palette.blueSat,
    activeSwitchShadow: 'hsl(144, 70%, 50%)',
    disabledSwitchShadow: palette.gray500,
    logoShadow: palette.gray500,

    // Text
    mainText: palette.offBlack,
    secondaryText: palette.offBlack2,
    tertiaryText: palette.offBlack3,
    quaternaryText: palette.offBlack4,
    quinaryText: palette.offBlack5,
    whiteText: palette.white,
    highContrastText: palette.black,
    invertedText: palette.gray100,
    activeText: palette.blueSat,
    blueText: palette.blue500,
    placeholderText: palette.offBlack2,
    buttonLabel: palette.offBlack,

    // Buttons
    blueButton: palette.blue500,
    blueButtonBorder: palette.blue450,
    blueButton2: palette.blue100,
    blueButtonBorder2: palette.blue100,
    grayButton: palette.gray250,
    grayButtonBorder: palette.gray275,
    mediumGrayButton: palette.gray250,
    mediumGrayButtonBorder: palette.gray300,
    tabNavPill: palette.blue500,
    tabGrayPill: palette.gray1000,
    tabGrayPillBorder: 'transparent',
    borderedGrayButton: palette.gray250,

    // Switch
    enabledSwitchPill: palette.gray100,
    enabledSwitchCrib: 'hsl(144, 70%, 65%)',
    disabledSwitchPill: palette.gray150,
    disabledSwitchCrib: palette.gray300,

    // Seperators
    lightseperator: palette.gray150,
    darkerseperator: palette.gray200,
    blueseperator: palette.blue100,

    // Misc
    alert: palette.red,
    pulseWaiting: palette.gray300,
    pulseGreen: palette.successGreenFaint,

    // Icons
    successIcon: palette.successGreen,
    grayIcon: palette.gray400,
  },
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 36,
    xxxl: 48,
    navHeight: 104
  },
  textVariants: {
    bold: {
      fontFamily: 'SourceSans3SemiBold',
      color: 'highContrastText',
    },
    header: {
      fontSize: 28,
      lineHeight: 32,
      marginTop: 'xs',
      marginLeft: 's',
      marginBottom: 'xs',
      fontFamily: 'SourceSans3SemiBold',
    },
    header2: {
      fontSize: 22,
      marginLeft: 'xs',
      lineHeight: 26,
      fontFamily: 'SourceSans3Medium',
      marginTop: 'm',
      marginBottom: 's',
    },
    boxHeader: {
      fontSize: 15,
      lineHeight: 20,
      fontFamily: 'SourceSans3Medium',
      marginTop: 'm',
      marginLeft: 'xs'
    },
    subheader: {
      fontSize: 24,
      lineHeight: 40,
      marginLeft: 'xs',
      marginTop: 's',
      marginBottom: 's',
      fontFamily: 'SourceSans3Medium',
      color: 'secondaryText',
    },
    subheader2: {
      fontSize: 16,
      marginLeft: 'xs',
      lineHeight: 22,
      fontFamily: 'SourceSans3Medium',
      color: 'tertiaryText',
    },
    label: {
      marginLeft: 'xs',
      fontFamily: 'SourceSans3Medium',
    },
    defaults: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'SourceSans3Regular',
      color: 'mainText',
    },
    footer: {
      fontSize: 14,
      lineHeight: 16,
      marginVertical: 's',
      fontFamily: 'SourceSans3Regular',
      color: 'quaternaryText',
    }
  },
  buttonVariants: {
    main: {
      padding: 'm',
      marginVertical: 's',
      borderRadius: 12,
      gap: 's',
      marginHorizontal: 'xxs',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'blueButton',
      color: 'whiteText',
      borderWidth: 1.5,
      borderColor: 'blueButtonBorder',
    },
    blueMain2: {
      padding: 'm',
      marginVertical: 's',
      borderRadius: 12,
      gap: 's',
      marginHorizontal: 'xxs',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'blueButton2',
      borderWidth: 1.5,
      borderColor: 'blueButtonBorder2',
      color: 'blueText',
    },
    grayMain: {
      padding: 'm',
      marginVertical: 's',
      borderRadius: 12,
      gap: 's',
      marginHorizontal: 'xxs',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'grayButton',
      color: 'mainText',
      borderWidth: 1.5,
      borderColor: 'grayButtonBorder',
    },
    mediumGrayMain: {
      padding: 'm',
      marginVertical: 's',
      borderRadius: 12,
      gap: 's',
      marginHorizontal: 'xxs',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'mediumGrayButton',
      borderWidth: 1.5,
      color: 'mainText',
      borderColor: 'mediumGrayButtonBorder',
    },
    borderedGrayMain: {
      padding: 'm',
      marginVertical: 's',
      borderRadius: 12,
      gap: 's',
      marginHorizontal: 'xxs',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'borderedGrayButton',
      color: 'secondaryText',
    },
    blueBorderedMain: {
      padding: 'm',
      borderRadius: 12,
      marginHorizontal: 'xxs',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'blueseperator',
      color: 'blueText',
    },
    socialSignIn: {
      padding: 's',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'darkerseperator',
      flexDirection: 'row',
    },
    grayLinkButton: {
      color: 'tertiaryText',
      paddingVertical: 'xxs',
    },
    grayPill: {
      paddingVertical: 'none',
      color: 'invertedText',
      paddingHorizontal: 'm',
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'grayButton',
      borderColor: 'transparent',
      borderWidth: 1.5,
    },
    transparentPill: {
      paddingVertical: 'none',
      paddingHorizontal: 'm',
      borderRadius: 40,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: 'transparent',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    circleButton: {
      padding: 'xs',
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'mediumGrayButton',
    },
    defaults: {
      padding: 's',
      alignItems: 'center',
      flexDirection: 'row',
      color: 'mainText',
      fontSize: 16,
      letterSpacing: 2,
    },
    bold: {
      fontFamily: 'SourceSans3Medium',
    }
  },
  seperatorVariants: {
    bare: {
      height: 1.25,
      backgroundColor: 'lightseperator',
    },
    s: {
      height: 1.25,
      marginVertical: 's',
      backgroundColor: 'lightseperator',
    },
    m: {
      height: 1.25,
      marginVertical: 'l',
      backgroundColor: 'lightseperator',
    },
    l: {
      height: 1.25,
      marginVertical: 'xl',
      backgroundColor: 'lightseperator',
    },
    xl: {
      height: 1.25,
      marginVertical: 'xxxl',
      backgroundColor: 'lightseperator',
    },
    defaults: {}
  },
  boxVariants: {
    header: {
      paddingHorizontal: 'l',
    },
    fullCentered: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 'l',
    },
    even: {
      flex: 1,
      justifyContent: 'space-evenly'
    },
    screen: {
      flex: 1,
      paddingHorizontal: 'l',
    },
    screenContent: {
      flex: 1,
      paddingHorizontal: 'xl',
      marginBottom: 'navHeight',
      paddingTop: 'l',
    },
    screenWithHeader: {
      flex: 1,
      marginTop: 'xxl',
      paddingHorizontal: 'l',
    },
    nestedContainer: {
      borderRadius: 12,
      paddingVertical: 'm',
      paddingHorizontal: 'l',
      marginVertical: 's',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: 'nestedContainer',
      borderColor: 'nestedContainerBorder',
      borderWidth: 1.5,
    },
    modalBox: {
      backgroundColor: 'modalBox',
      borderTopEndRadius: 20,
      borderTopStartRadius: 20,
      shadowColor: 'navShadow',
      shadowOpacity: 0.5,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: -4 },
    },
    bottomNav: {
      paddingHorizontal: 'l',
    },
    footer: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 'xl',
      right: 24,
      left: 24,
      bottom: 0,
      zIndex: 100
    },
    modal: {
      backgroundColor: 'nestedContainer',
      borderRadius: 12,
      padding: 'l',
      gap: 'm',
    },
    defaults: {}
  },
});

export type Theme = typeof lightTheme;
