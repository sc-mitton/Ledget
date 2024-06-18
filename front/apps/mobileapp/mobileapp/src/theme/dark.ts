import { createTheme } from '@shopify/restyle';
import { lightTheme } from "./light";

export const darkTheme = createTheme({
  ...lightTheme,
});
