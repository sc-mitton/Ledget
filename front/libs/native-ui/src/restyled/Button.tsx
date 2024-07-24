import {
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent
} from 'react-native';
import {
  useRestyle,
  spacing,
  layout,
  border,
  typography,
  createVariant,
  backgroundColor,
  SpacingProps,
  TypographyProps,
  VariantProps,
  LayoutProps,
  BackgroundColorProps,
  BorderProps,
  composeRestyleFunctions,
} from '@shopify/restyle';

import { Text } from './Text';
import { Theme } from '../theme';

type RestyleProps = SpacingProps<Theme> &
  VariantProps<Theme, 'buttonVariants'> &
  LayoutProps<Theme> &
  TypographyProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme>;

const variant = createVariant({ themeKey: 'buttonVariants' });

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  variant,
  backgroundColor,
  layout,
  typography,
  border as any,
]);

export type Props = RestyleProps & {
  onPress?: () => void;
  label?: string;
  children?: React.ReactNode;
  labelPlacement?: 'left' | 'right';
  textColor?: string;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
};

export const Button = (props: Props) => {
  const {
    onPress,
    label,
    children,
    transparent,
    style,
    textColor,
    labelPlacement = 'right',
    onLayout,
    ...rest
  } = props;
  const restyledProps = useRestyle(restyleFunctions, rest);
  const color = (restyledProps as any).style[0]?.color;
  const fontSize = (restyledProps as any).style[0]?.fontSize;
  const lineHeight = (restyledProps as any).style[0]?.lineHeight;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={.8}
      style={style}
      onLayout={onLayout}
    >
      <View {...restyledProps}>
        {labelPlacement === 'right' && children}
        <Text
          color={textColor}
          fontSize={fontSize}
          lineHeight={lineHeight}
          style={textColor ? {} : { color: transparent ? 'transparent' : color ? color : '' }}>
          {label}
        </Text>
        {labelPlacement === 'left' && children}
        {!labelPlacement && children}
      </View>
    </TouchableOpacity>
  );
};
