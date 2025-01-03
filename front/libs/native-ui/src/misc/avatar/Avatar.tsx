import { View, Text } from 'react-native';
import { useTheme } from '@shopify/restyle';

import styles from './styles';
import { Box } from '../../restyled/Box';

interface Props {
  size: 's' | 'm' | 'l' | 'xl';
  name?: {
    first: string;
    last: string;
  };
}

export const Avatar = (props: Props) => {
  const theme = useTheme();

  return (
    <View style={[styles.avatar, styles[`${props.size}Container`]]}>
      <Text
        style={[
          styles[props.size],
          {
            color: props.name?.first[0]
              ? theme.colors.whiteText
              : 'transparent',
            fontFamily: 'SourceSans3Regular',
          },
        ]}
      >
        {`${props.name?.first[0] || 'A'}`}
      </Text>
      <Text
        style={[
          styles[props.size],
          {
            color: props.name?.last[0] ? theme.colors.whiteText : 'transparent',
            fontFamily: 'SourceSans3Regular',
          },
        ]}
      >
        {`${props.name?.last[0] || 'B'}`}
      </Text>
      <View style={styles.backgroundContainer}>
        <Box
          backgroundColor="avatar"
          style={[styles.background, styles[`${props.size}Circle`]]}
        />
      </View>
    </View>
  );
};
