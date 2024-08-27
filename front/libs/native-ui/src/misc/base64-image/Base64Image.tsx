import { Image, StyleProp, ViewStyle } from 'react-native';
import { Box } from '../../restyled/Box';
import {
  BorderProps,
  BackgroundColorProps,
  ShadowProps,
  composeRestyleFunctions,
  border,
  backgroundColor,
  shadow,
  useRestyle
} from '@shopify/restyle';
import { Theme } from '../../theme';

const restyleFunctions = composeRestyleFunctions([border, shadow, backgroundColor])

export type Props = {
  data?: string;
  alt?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
} & BorderProps<Theme> & ShadowProps<Theme> & BackgroundColorProps<Theme>;

export const Base64Image = ({ data, alt, size = 20, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions as any, rest);

  return (
    <Box {...props}>
      <Image
        style={{ width: size, height: size }}
        source={{ uri: `data:image/png;base64,${data}` }}
        resizeMode='contain'
        alt={alt}
      />
    </Box>
  )
}
