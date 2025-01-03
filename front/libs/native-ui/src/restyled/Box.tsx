import { forwardRef } from 'react';
import { createBox } from '@shopify/restyle';
import { ViewProps, View } from 'react-native';
import Animated, {
  LinearTransition,
  BaseAnimationBuilder,
  LayoutAnimationFunction,
} from 'react-native-reanimated';
import {
  useRestyle,
  createVariant,
  backgroundColor,
  spacing,
  layout,
  shadow,
  border,
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
