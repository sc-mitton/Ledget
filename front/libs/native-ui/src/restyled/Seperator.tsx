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

const BaseBox = createBox<Theme>();

const variant = createVariant({ themeKey: 'seperatorVariants' });

type RestyleProps =
  VariantProps<Theme, 'seperatorVariants'> &
  BackgroundColorProps<Theme> &
  ColorProps<Theme> &
  LayoutProps<Theme>;

type Props = RestyleProps & { label?: string, color?: string };

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([variant, backgroundColor, color, layout]);


export const Seperator = ({ label, ...rest }: Props) => {
  const {
    variant = 's',
    backgroundColor = 'seperator',
    flex = 1,
  } = rest;

  const restyledprops = useRestyle((restyleFunctions as any), { ...rest, variant, backgroundColor, flex } as any);

  return (
    <BaseBox flexDirection='row' alignItems='center'>
      <BaseBox {...restyledprops} />
      {label &&
        <Text paddingHorizontal='m'>
          {label}
        </Text>
      }
      <BaseBox {...restyledprops} />
    </BaseBox>
  );
}
