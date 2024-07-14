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
import { Theme } from '../theme/light';

const Box = createBox<Theme>();

const variant = createVariant({ themeKey: 'seperatorVariants' });

type RestyleProps = VariantProps<Theme, 'seperatorVariants'> & BackgroundColorProps<Theme> & ColorProps<Theme>;

type Props = RestyleProps & { label?: string, color?: string };

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([variant, backgroundColor, color]);


export const Seperator = ({ label, ...rest }: Props) => {

  const restyledprops = useRestyle(restyleFunctions, rest);

  return (
    <Box flexDirection='row' alignItems='center'>
      <Box {...restyledprops} />
      {label &&
        <Text paddingHorizontal='m'>
          {label}
        </Text>
      }
      <Box {...restyledprops} />
    </Box>
  );
}

Seperator.defaultProps = {
  variant: 's',
  backgroundColor: 'lightSeperator',
  flex: 1
}
