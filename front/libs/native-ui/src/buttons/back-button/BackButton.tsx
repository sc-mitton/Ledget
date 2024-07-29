import { TouchableOpacity, View } from 'react-native';

import styles from './styles';
import { Text } from '../../restyled/Text';
import { ChevronLeft } from 'geist-native-icons';
import { useTheme } from '@shopify/restyle';

export const BackButton = ({ onPress, label }: { onPress: () => void, label?: string }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.5}>
      <View style={styles.chevronContainer}>
        <ChevronLeft stroke={theme.colors.blueText} size={22} strokeWidth={2} />
      </View>
      <Text color={'blueText'} fontSize={20}>
        {label ? label : 'back'}
      </Text>
    </TouchableOpacity>
  )
}
