import {
  useRestyle,
  composeRestyleFunctions,
  createVariant,
  VariantProps,
  BackgroundColorProps,
} from '@shopify/restyle';

import { Text } from './Text';
import { Box } from './Box';
import { Theme } from '../../theme';

const variant = createVariant({ themeKey: 'seperatorVariants' });

type RestyleProps = VariantProps<Theme, 'seperatorVariants'> & BackgroundColorProps<Theme>;

type Props = RestyleProps & { label?: string, color?: string };

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([variant]);


export const Seperator = ({ label, color, ...rest }: Props) => {

  const restyledprops = useRestyle(restyleFunctions, rest);

  return (
    <Box flexDirection='row' alignItems='center'>
      <Box
        backgroundColor={color || 'seperator'}
        height={1}
        flex={1}

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
