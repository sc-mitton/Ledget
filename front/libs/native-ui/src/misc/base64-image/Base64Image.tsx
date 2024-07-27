import { Image } from 'react-native';
import { Box } from '../../restyled/Box';

interface Props {
  data?: string;
  alt?: string;
  size?: number;
  border?: number;
}

export const Base64Image = (props: Props) => {
  const { data, alt, size = 20, border = 1.5 } = props
  return (
    <Box
      borderColor='quinaryText'
      borderWidth={border}
      borderRadius={20}
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
