import { TouchableOpacity } from 'react-native';

import { Text } from '../../restyled/Text';
import { ChevronLeft } from 'geist-icons-native';
import { useTheme } from '@shopify/restyle';

import styles from './styles';

export const BackButton = ({ onPress, label }: { onPress: () => void, label?: string }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.5}>
      <ChevronLeft stroke={theme.colors.blueText} size={18} />
      <Text color={'blueText'} fontSize={18}>{label ? label : 'back'}</Text>
    </TouchableOpacity>
  )
}
