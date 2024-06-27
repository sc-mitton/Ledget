import {
  useRestyle,
  composeRestyleFunctions,
  createVariant,
  VariantProps,
  BackgroundColorProps,
  ColorProps,
  backgroundColor,
  color,
  createBox
} from '@shopify/restyle';

import { Text } from './Text';
import { Theme } from '../../theme';

const Box = createBox<Theme>();

const variant = createVariant({ themeKey: 'seperatorVariants' });

type RestyleProps = VariantProps<Theme, 'seperatorVariants'> & BackgroundColorProps<Theme> & ColorProps<Theme>;

type Props = RestyleProps & { label?: string, color?: string };

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([variant, backgroundColor, color]);


export const Seperator = ({ label, ...rest }: Props) => {

  const { color, variant } = rest;
  const restyledprops = useRestyle(restyleFunctions, rest);

  return (
    <Box
      flexDirection='row'
      alignItems='center'
      paddingHorizontal='s'
    >
      <Box
        backgroundColor={color || 'seperator'}
        height={1}
        flex={1}
        variant={variant}
        {...restyledprops}
      />
      {label &&
        <Text
          paddingLeft='m'
          paddingRight='m'
        >
          {label}
        </Text>
      }
      <Box
        backgroundColor={color || 'seperator'}
        height={1}
        flex={1}
        {...restyledprops}
      />
    </Box>
  );
}
