import {
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
  PressableProps,
} from 'react-native';
import {
  useRestyle,
  spacing,
  layout,
  border,
  shadow,
  typography,
  createVariant,
  backgroundColor,
  SpacingProps,
  TypographyProps,
  VariantProps,
  LayoutProps,
  BackgroundColorProps,
  BorderProps,
  ShadowProps,
  composeRestyleFunctions,
} from '@shopify/restyle';

import { Text } from './Text';
import { Box } from './Box';
import { Theme } from '../theme';

export type RestyleProps = SpacingProps<Theme> &
  VariantProps<Theme, 'buttonVariants'> &
  LayoutProps<Theme> &
  TypographyProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  ShadowProps<Theme>;

const variant = createVariant({ themeKey: 'buttonVariants' });

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  variant,
  backgroundColor,
  layout,
  typography,
  border as any,
  shadow,
]);

export type ButtonProps = RestyleProps &
  Omit<PressableProps, 'children'> & {
    onPress?: () => void;
    label?: string;
    children?:
      | React.ReactNode
      | ((props: { color: string }) => React.ReactNode);
    labelPlacement?: 'left' | 'right';
    textColor?: string;
    transparent?: boolean;
    style?: StyleProp<ViewStyle>;
    icon?: React.ReactNode;
  };

export const Button = (props: ButtonProps) => {
  const {
    onPress,
    label,
    children,
    transparent,
    style,
    textColor,
    labelPlacement = 'right',
    onLayout,
    icon,
    ...rest
  } = props;
  const restyledProps = useRestyle(restyleFunctions, rest);
  const color = (restyledProps as any).style[0]?.color;
  const fontSize = (restyledProps as any).style[0]?.fontSize;
  const lineHeight = (restyledProps as any).style[0]?.lineHeight;
  const fontFamily = (restyledProps as any).style[0]?.fontFamily;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={style}
      onLayout={onLayout}
      disabled={props.disabled ? true : false}
    >
      <View {...restyledProps}>
        <Box flexDirection="row" gap="s" alignItems="center">
          {labelPlacement === 'left'
            ? typeof children === 'function'
              ? children({ color })
              : children
            : null}
          {labelPlacement === 'right' && icon}
          {label && (
            <Text
              fontFamily={fontFamily}
              color={transparent ? 'transparent' : textColor}
              fontSize={fontSize}
              lineHeight={lineHeight}
              style={
                textColor
                  ? {}
                  : { color: transparent ? 'transparent' : color ? color : '' }
              }
            >
              {label}
            </Text>
          )}
          {!labelPlacement || labelPlacement === 'right'
            ? typeof children === 'function'
              ? children({ color })
              : children
            : null}
          {labelPlacement === 'left' && icon}
        </Box>
      </View>
    </TouchableOpacity>
  );
};
