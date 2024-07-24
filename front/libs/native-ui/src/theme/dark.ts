import { createTheme } from '@shopify/restyle';
import { lightTheme } from "./light";
import basePalette from './base-palette';

const grayH = 240;
const grayS = 7;

const blueH = 226;
const blueS = 50;

const palette = {
  ...basePalette,

  mutedRed: 'hsl(352, 30%, 30%)',
  red: 'hsl(352, 56%, 49%)',
  darkRed: 'hsl(0, 59%, 34%)',
  successGreen: 'hsl(144, 62%, 33%)',
  successGreenFaint: 'hsl(144, 62%, 18%)',

  gray1000: `hsl(${grayH}, ${grayS}%, 0%)`,
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
  offWhite5: `hsl(${grayH}, ${grayS}%, 50%)`,
  offWhite6: `hsl(${grayH}, ${grayS}%, 40%)`,
  offWhite7: `hsl(${grayH}, ${grayS}%, 30%)`,
}

export const darkTheme = createTheme({
  ...lightTheme,
  colors: {
    ...lightTheme.colors,

    // Backgrounds
    mainBackground: palette.gray900,
    headerBackground: `hsl(${grayH}, ${grayS}%, 7%)`,
    navBackground: palette.gray850,
    nestedContainer: `hsl(${grayH}, ${grayS}%, 9%)`,
    inputBackground: palette.gray800,
    avatarBackground: palette.gray800,
    tabNavPill: palette.blue700,
    avatar: palette.gray800,
    modalOverlay: palette.gray900,
    modalBox: palette.gray850,

    // Borders
    inputBorder: palette.gray750,
    inputBorderErrorMain: palette.red,
    inputBorderErrorSecondary: palette.mutedRed,
    focusedInputBorderMain: palette.blue400,
    focusedInputBorderSecondary: palette.blue800,
    tabNavPillBorder: palette.blue500,
    bottomNavBorder: palette.gray750,
    nestedContainerBorder: `hsl(${grayH}, ${grayS}%, 11%)`,

    // Shadows
    navShadow: palette.gray1000,
    tabsShadow: palette.gray1000,
    activeSwitchShadow: palette.blue700,
    disabledSwitchShadow: palette.gray700,

    // Icons
    activeIcon: palette.blueSat,

    // Text
    mainText: palette.offWhite,
    secondaryText: palette.offWhite3,
    tertiaryText: palette.offWhite5,
    quaternaryText: palette.offWhite6,
    quinaryText: palette.offWhite7,
    activeText: palette.blueSat,
    invertedText: palette.gray900,
    highContrastText: palette.offWhite,
    whiteText: palette.offWhite,
    focusedText: palette.blueSat,
    blueText: palette.blue200,
    placeholderText: palette.offWhite4,
    buttonLabel: palette.white,

    // Buttons
    blueButton: palette.blue500,
    blueButtonBorder: palette.blue400,
    blueButton2: palette.blue800,
    blueButtonBorder2: palette.blue700,
    grayButton: palette.gray800,
    mediumGrayButton: palette.gray700,
    grayButtonBorder: palette.gray750,

    // Switch
    enabledSwitchPill: palette.blue200,
    enabledSwitchCrib: palette.blue600,
    disabledSwitchPill: palette.gray200,
    disabledSwitchCrib: palette.gray600,

    // Seperators
    seperator: `hsl(${grayH}, ${grayS}%, 17%)`,
    seperator2: `hsl(${grayH}, ${grayS}%, 17%)`,
    lightSeperator: palette.gray800,
    blueseperator: palette.blue400,

    // Misc
    alert: palette.red,
    pulseWaiting: palette.gray700,
    pulseGreen: palette.successGreenFaint,
    successIcon: palette.successGreen,
    grayIcon: palette.gray100,
    shimmer: palette.gray850,
  }
});
