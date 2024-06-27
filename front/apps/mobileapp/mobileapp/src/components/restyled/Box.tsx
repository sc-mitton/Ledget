import { createBox } from "@shopify/restyle";
import {
  useRestyle,
  createVariant,
  backgroundColor,
  spacing,
  layout,
  border,
  SpacingProps,
  BorderProps,
  LayoutProps,
  VariantProps,
  BackgroundColorProps,
  composeRestyleFunctions,
} from '@shopify/restyle';

import { Theme } from '@theme';

const BaseBox = createBox();

type RestyleProps = SpacingProps<Theme> &
  VariantProps<Theme, 'boxVariants'> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  LayoutProps<Theme>;

const variant = createVariant({ themeKey: 'boxVariants' });

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  variant,
  backgroundColor,
  spacing,
  layout,
]);

type Props = RestyleProps & { children?: React.ReactNode, style?: object };

export const Box = ({ children, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);

  return <BaseBox {...props}>{children}</BaseBox>;
};
