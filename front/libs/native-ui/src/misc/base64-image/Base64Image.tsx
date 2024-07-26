import { Image, View } from 'react-native'

interface Props {
  data?: string;
  alt?: string;
  size?: number;
}

export const Base64Image = (props: Props) => {
  const { data, alt, size = 20 } = props
  return (
    <View style={{ width: size, height: size }}>
      <Image
        style={{ width: size, height: size }}
        source={{ uri: `data:image/png;base64,${data}` }}
        resizeMode='contain'
        alt={alt}
      />
    </View>
  )
}
