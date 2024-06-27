import { TouchableOpacity, View } from 'react-native';
import {
  useRestyle,
  spacing,
  createVariant,
  backgroundColor,
  SpacingProps,
  VariantProps,
  BackgroundColorProps,
  composeRestyleFunctions,
} from '@shopify/restyle';

import { Text } from './Text';
import { Theme } from '../../theme';

type RestyleProps = SpacingProps<Theme> &
  VariantProps<Theme, 'buttonVariants'> &
  BackgroundColorProps<Theme>;

const variant = createVariant({ themeKey: 'buttonVariants' });

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  variant,
  backgroundColor,
]);

type Props = RestyleProps & {
  onPress: () => void;
  label?: string;
  textColor?: string;
  children?: React.ReactNode;
  labelPlacement?: 'left' | 'right';
};

export const Button = ({ onPress, label, textColor, children, labelPlacement = 'right', ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={.8}>
      <View {...props}>
        {labelPlacement === 'right' && children}
        {label &&
          <Text
            {...((props as any).style[0].color
              ? { style: { color: (props as any).style[0].color } }
              : {})}>
            {label}
          </Text>}
        {labelPlacement === 'left' && children}
      </View>
    </TouchableOpacity>
  );
};
