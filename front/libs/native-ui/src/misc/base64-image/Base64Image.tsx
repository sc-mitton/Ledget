import { Image, StyleProp, ViewStyle } from 'react-native';
import { Box } from '../../restyled/Box';
import {
  BorderProps,
  ShadowProps,
  composeRestyleFunctions,
  border,
  shadow,
  useRestyle
} from '@shopify/restyle';
import { Theme } from '../../theme';

const restyleFunctions = composeRestyleFunctions([border, shadow])

export type Props = {
  data?: string;
  alt?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
} & BorderProps<Theme> & ShadowProps<Theme>

export const Base64Image = ({ data, alt, style, size = 20, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions as any, rest);

  return (
    <Box
      borderColor='quinaryText'
      borderRadius={20}
      style={style}
      {...props}
    >
      <Image
        style={{ width: size, height: size }}
        source={{ uri: `data:image/png;base64,${data}` }}
        resizeMode='contain'
        alt={alt}
      />
    </Box>
  )
}
