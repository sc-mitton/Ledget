import { View, Text } from 'react-native';
import { useTheme } from '@shopify/restyle';

import styles from './styles';
import { Box } from '../../restyled/Box';

interface Props {
  size: 's' | 'm' | 'l';
  name?: {
    first: string;
    last: string;
  }
}

export const Avatar = (props: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.avatar}>
      <Text
        style={[
          styles[props.size],
          { color: theme.colors.whiteText, fontFamily: 'SourceSans3Regular' },
        ]}
      >
        {`${props.name?.first[0]} ${props.name?.last[0]}`}
      </Text>
      <View style={styles.backgroundContainer}>
        <Box backgroundColor='avatar' style={[styles.background, styles[`${props.size}Circle`]]} />
      </View>
    </View>
  )
}
