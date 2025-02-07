import { forwardRef } from 'react';
import { ViewProps, View } from 'react-native';
import Animated, {
  BaseAnimationBuilder,
  LayoutAnimationFunction,
} from 'react-native-reanimated';
import {
  useRestyle,
  createVariant,
  backgroundColor,
  spacing,
  layout,
  opacity,
  shadow,
  border,
  ShadowProps,
  SpacingProps,
  BorderProps,
  LayoutProps,
  OpacityProps,
  VariantProps,
  BackgroundColorProps,
  composeRestyleFunctions,
} from '@shopify/restyle';

import { Theme } from '../theme';

type RestyleProps = SpacingProps<Theme> &
  VariantProps<Theme, 'boxVariants'> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  LayoutProps<Theme> &
  OpacityProps<Theme>;

const variant = createVariant({ themeKey: 'boxVariants' });

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  variant,
  backgroundColor,
  opacity as any,
  spacing,
  layout,
  shadow,
  border,
]);

export type BoxProps = RestyleProps &
  ViewProps & {
    layout?:
      | LayoutAnimationFunction
      | typeof BaseAnimationBuilder
      | BaseAnimationBuilder;
  };

export const Box = forwardRef<View, BoxProps>(
  ({ children, layout, ...rest }, ref) => {
    const props = useRestyle(restyleFunctions, rest);

    return (
      <Animated.View ref={ref} {...props} layout={layout}>
        {children}
      </Animated.View>
    );
  }
);
