import {
  useRestyle,
  composeRestyleFunctions,
  createVariant,
  VariantProps,
  BackgroundColorProps,
  ColorProps,
  LayoutProps,
  backgroundColor,
  color,
  layout,
  createBox
} from '@shopify/restyle';

import { Text } from './Text';
import { Theme } from '../theme/light';

const Box = createBox<Theme>();

const variant = createVariant({ themeKey: 'seperatorVariants' });

type RestyleProps = VariantProps<Theme, 'seperatorVariants'> & BackgroundColorProps<Theme> & ColorProps<Theme> & LayoutProps<Theme>;

type Props = RestyleProps & { label?: string, color?: string };

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([variant, backgroundColor, color, layout]);


export const Seperator = ({ label, ...rest }: Props) => {
  const {
    variant = 's',
    backgroundColor = 'lightSeperator',
    flex = 1,
  } = rest;

  const restyledprops = useRestyle((restyleFunctions as any), { ...rest, variant, backgroundColor, flex });

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


export const Seperator2 = ({ label, ...rest }: Props) => {
  const {
    variant = 's',
    backgroundColor = 'seperator',
    flex = 1,
  } = rest;

  const restyledprops = useRestyle((restyleFunctions as any), { ...rest, variant, backgroundColor, flex });

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
