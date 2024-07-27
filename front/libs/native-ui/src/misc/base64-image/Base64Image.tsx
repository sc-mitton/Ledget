import { Image, StyleProp, ViewStyle } from 'react-native';
import { Box } from '../../restyled/Box';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

export interface Props {
  data?: string;
  alt?: string;
  size?: number;
  border?: number;
  style?: StyleProp<ViewStyle>;
}

export const Base64Image = (props: Props) => {
  const { data, alt, size = 20, border = 1.5 } = props
  return (
    <Box
      borderColor='quinaryText'
      borderWidth={border}
      borderRadius={20}
      style={props.style}
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
