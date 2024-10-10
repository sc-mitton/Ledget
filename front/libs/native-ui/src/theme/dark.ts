import { createTheme } from '@shopify/restyle';
import { Platform } from 'react-native';

import { lightTheme } from "./light";
import basePalette from './base-palette';

const grayH = 240;
const grayS = 5;

const blueH = 230;
const blueS = 55;

const greenH = 170;

const palette = {
  ...basePalette,

  mutedRed: 'hsl(352, 30%, 30%)',
  red: 'hsl(352, 56%, 49%)',
  darkRed: 'hsl(0, 59%, 34%)',
  successGreen: 'hsl(144, 62%, 33%)',
  successGreenFaint: 'hsl(144, 62%, 18%)',
  greenText: 'hsl(144, 62%, 40%)',

  gray1000: `hsl(${grayH}, ${grayS}%, 0%)`,
  gray900: `hsl(${grayH}, ${grayS}%, 7%)`,
  gray850: `hsl(${grayH}, ${grayS}%, 11%)`,
  gray800: `hsl(${grayH}, ${grayS}%, 14%)`,
  gray775: `hsl(${grayH}, ${grayS}%, 15%)`,
  gray750: `hsl(${grayH}, ${grayS}%, 17%)`,
  gray700: `hsl(${grayH}, ${grayS}%, 20%)`,
  gray650: `hsl(${grayH}, ${grayS}%, 22%)`,
  gray600: `hsl(${grayH}, ${grayS}%, 25%)`,
  gray500: `hsl(${grayH}, ${grayS}%, 30%)`,
  gray400: `hsl(${grayH}, ${grayS}%, 35%)`,
  gray300: `hsl(${grayH}, ${grayS}%, 40%)`,
  gray200: `hsl(${grayH}, ${grayS}%, 45%)`,
  gray100: `hsl(${grayH}, ${grayS}%, 50%)`,

  blue900: `hsl(${blueH}, ${blueS}%, 10%)`,
  blue800: `hsl(${blueH}, ${blueS}%, 15%)`,
  blue700: `hsl(${blueH}, ${blueS}%, 20%)`,
  blue650: `hsl(${blueH}, ${blueS}%, 22%)`,
  blue600: `hsl(${blueH}, ${blueS}%, 25%)`,
  blue500: `hsl(${blueH}, ${blueS}%, 30%)`,
  blue400: `hsl(${blueH}, ${blueS}%, 35%)`,
  blue300: `hsl(${blueH}, ${blueS}%, 40%)`,
  blue200: `hsl(${blueH}, ${blueS}%, 45%)`,
  blue100: `hsl(${blueH}, ${blueS + 20}%, 60%)`,
  blue50: `hsl(${blueH}, ${blueS + 20}%, 65%)`,

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
    mode: 'dark',
    blueHue: `${blueH}`,

    // Backgrounds
    mainBackground: palette.gray900,
    accountsMainBackground: palette.gray900,
    bottomNavBackground: palette.gray900,
    androidNavBar: palette.gray850,
    bottomNavCover: `hsl(${grayH}, ${grayS}%, 10%)`,
    nestedContainer: palette.gray850,
    lightGrayCard: palette.gray850,
    inputBackground: palette.gray800,
    tabNavPill: palette.blue800,
    avatar: palette.gray700,
    modalOverlay: palette.gray1000,
    modalBox: palette.gray850,
    modalBox100: palette.gray850,
    nestedModalContainer: palette.gray800,
    newTransaction: palette.gray750,
    contextMenu: palette.gray700,
    toast: palette.gray850,
    creditCardGradientStart: `hsl(${blueH}, ${blueS}%, 30%)`,
    creditCardGradientEnd: `hsl(${blueH}, ${blueS}%, 42%)`,

    // Borders
    inputBorder: palette.gray775,
    inputBorderErrorMain: palette.red,
    inputBorderErrorSecondary: palette.mutedRed,
    focusedInputBorderMain: palette.blue400,
    focusedInputBorderSecondary: palette.blue800,
    tabNavPillBorder: 'transparent',
    bottomNavBorder: palette.gray850,
    nestedContainerBorder: 'transparent',
    tabNavBorder: palette.gray800,
    newTransactionBorder: palette.gray700,
    contextMenuBorder: palette.gray650,
    toastBorder: palette.gray800,
    modalBorder: palette.gray800,
    contextMenuDivider: palette.gray600,
    creditCardBorderStart: `hsl(${blueH}, ${blueS}%, 72%)`,
    creditCardBorderStop: `hsl(${blueH}, ${blueS}%, 38%)`,

    // Shadows
    navShadow: palette.gray900,
    modalShadow: palette.gray1000,
    tabsShadow: palette.gray1000,
    activeSwitchShadow: 'hsl(144, 80%, 17%)',
    disabledSwitchShadow: palette.gray700,
    logoShadow: palette.gray900,
    newTransactionShadow: Platform.OS === 'android' ? palette.gray900 : palette.gray850,
    menuShadowColor: palette.gray900,
    creditCardShadow: palette.gray900,

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
    blueText: palette.blue100,
    blueTextSecondary: palette.blue50.replace(`${blueS}`, `${blueS}`),
    faintBlueText: palette.blue300.replace(`${blueS}`, `${blueS - 10}`),
    placeholderText: palette.offWhite4,
    buttonLabel: palette.white,
    greenText: palette.greenText,
    footerText: palette.gray600,

    // Buttons
    lightBlueButton: palette.blue800,
    lightBlueButtonBorder: palette.blue700,
    mediumBlueButton: palette.blue600,
    mediumBlueButtonBorder: palette.blue500,
    blueButton: palette.blue400,
    blueButtonBorder: palette.blue400,
    lightGrayButton: palette.gray800,
    darkGrayButton: palette.gray800,
    grayButton: `hsl(${grayH}, ${grayS}%, 11%)`,
    grayButtonBorder: `hsl(${grayH}, ${grayS}%, 12%)`,
    mediumGrayButton: palette.gray700,
    mediumGrayButtonBorder: palette.gray650,
    borderedGrayButton: palette.gray700,
    dragBar: palette.gray750,
    tabsTrack: palette.gray800,
    tabsBackground: palette.gray700,
    radioCardSelected: palette.gray750,
    radioCardUnselected: palette.gray800,

    // Category and Bill Colors
    monthBackground: `hsl(${blueH}, 50%, 25%)`,
    monthBorder: `hsl(${blueH}, 50%, 31%)`,
    monthColor: `hsl(${blueH}, 100%, 70%)`,
    yearBackground: `hsl(${greenH}, 58%, 17%)`,
    yearBorder: `hsl(${greenH}, 58%, 24%)`,
    yearColor: `hsl(${greenH}, 90%, 50%)`,

    // Switch
    enabledSwitchPill: `hsl(${grayH}, ${grayS}%, 70%)`,
    enabledSwitchCrib: 'hsl(144, 85%, 23%)',
    disabledSwitchPill: palette.gray200,
    disabledSwitchCrib: palette.gray600,

    // Seperators
    seperator: palette.gray800,
    modalSeperator: palette.gray800,
    menuSeperator: palette.gray650,
    mainScreenSeperator: palette.gray850,
    nestedContainerSeperator: palette.gray800,
    authScreenSeperator: palette.gray750,

    // Misc
    alert: palette.red,
    pulseWaiting: palette.gray700,
    pulseGreen: palette.successGreenFaint,
    successIcon: palette.successGreen,
    grayIcon: palette.gray100,
    scrollbar: palette.gray750,
    transactionShimmer: palette.gray800,
    screenHeader: palette.gray800,

    blueChartGradientStart: palette.blue900.replace(`${blueS}`, `${blueS - 20}`),
    blueChartGradientEnd: `hsla(${grayH}, ${grayS}%, 10%, 0)`,
    blueChartColor: palette.blue400,
    emptyChartGradientStart: palette.gray750,
  }
});
