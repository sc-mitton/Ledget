import { TouchableOpacity, View } from 'react-native';
import {
  useRestyle,
  spacing,
  layout,
  createVariant,
  backgroundColor,
  SpacingProps,
  VariantProps,
  LayoutProps,
  BackgroundColorProps,
  composeRestyleFunctions,
} from '@shopify/restyle';

import { Text } from './Text';
import { Theme } from '../theme';

type RestyleProps = SpacingProps<Theme> &
  VariantProps<Theme, 'buttonVariants'> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme>;

const variant = createVariant({ themeKey: 'buttonVariants' });

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  variant,
  backgroundColor,
  layout,
]);

export type Props = RestyleProps & {
  onPress: () => void;
  label?: string;
  children?: React.ReactNode;
  labelPlacement?: 'left' | 'right';
  transparent?: boolean;
};

export const Button = ({ onPress, label, children, transparent, labelPlacement = 'right', ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);
  const color = (props as any).style[0].color;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={.8}>
      <View {...props}>
        {labelPlacement === 'right' && children}
        <Text style={{ color: transparent ? 'transparent' : color ? color : '' }}>
          {label}
        </Text>
        {labelPlacement === 'left' && children}
        {!labelPlacement && children}
      </View>
    </TouchableOpacity>
  );
};
