import { forwardRef } from "react";
import { createBox } from "@shopify/restyle";
import { ViewProps, View } from "react-native";
import {
  useRestyle,
  createVariant,
  backgroundColor,
  spacing,
  layout,
  shadow,
  ShadowProps,
  SpacingProps,
  BorderProps,
  LayoutProps,
  VariantProps,
  BackgroundColorProps,
  composeRestyleFunctions,
} from '@shopify/restyle';

import { Theme } from '../theme';

const BaseBox = createBox();

type RestyleProps = SpacingProps<Theme> &
  VariantProps<Theme, 'boxVariants'> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  LayoutProps<Theme>;

const variant = createVariant({ themeKey: 'boxVariants' });

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  variant,
  backgroundColor,
  spacing,
  layout,
  shadow,
]);

export type BoxProps = RestyleProps & ViewProps;

export const Box = forwardRef<View, BoxProps>(({ children, ...rest }, ref) => {
  const props = useRestyle(restyleFunctions, rest);

  return <BaseBox ref={ref} {...props}>{children}</BaseBox>;
});
