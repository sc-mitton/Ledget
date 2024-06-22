import { createTheme } from '@shopify/restyle';
import { lightTheme } from "./light";
import basePalette from './base-palette';


const grayH = 240;
const grayS = 3;

const blueH = 226;
const blueS = 45;

const palette = {
  ...basePalette,
  gray900: `hsl(${grayH}, ${grayS}%, 5%)`,
  gray800: `hsl(${grayH}, ${grayS}%, 13%)`,
  gray700: `hsl(${grayH}, ${grayS}%, 25%)`,
  gray600: `hsl(${grayH}, ${grayS}%, 35%)`,
  gray500: `hsl(${grayH}, ${grayS}%, 44%)`,
  gray400: `hsl(${grayH}, ${grayS}%, 53%)`,
  gray300: `hsl(${grayH}, ${grayS}%, 62%)`,
  gray200: `hsl(${grayH}, ${grayS}%, 71%)`,
  gray100: `hsl(${grayH}, ${grayS}%, 80%)`,


  blue900: `hsl(${blueH}, ${blueS}%, 10%)`,
  blue800: `hsl(${blueH}, ${blueS}%, 20%)`,
  blue700: `hsl(${blueH}, ${blueS}%, 30%)`,
  blue600: `hsl(${blueH}, ${blueS}%, 40%)`,
  blue500: `hsl(${blueH}, ${blueS}%, 50%)`,
  blue400: `hsl(${blueH}, ${blueS}%, 60%)`,
  blue300: `hsl(${blueH}, ${blueS}%, 70%)`,
  blue200: `hsl(${blueH}, ${blueS}%, 80%)`,
  blue100: `hsl(${blueH}, ${blueS}%, 90%)`,
}

export const darkTheme = createTheme({
  ...lightTheme,
  color: {
    ...lightTheme.colors,
    mainBackground: palette.gray900,
  }
});
