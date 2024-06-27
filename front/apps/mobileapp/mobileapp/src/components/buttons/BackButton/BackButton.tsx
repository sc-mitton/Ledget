import { TouchableOpacity } from 'react-native';

import { Text } from '@components';
import { ChevronLeft } from 'geist-icons-native';
import { useTheme } from '@shopify/restyle';

import styles from './styles';

export const BackButton = ({ onPress, label }: { onPress: () => void, label?: string }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ChevronLeft stroke={theme.colors.blueText} />
      <Text color={'blueText'} fontSize={18}>{label ? label : 'back'}</Text>
    </TouchableOpacity>
  )
}
