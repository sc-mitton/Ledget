import { StackHeaderProps } from '@react-navigation/stack';

import { Box } from '../restyled/Box';
import { BackButton } from '../buttons/BackButton/BackButton';
import styles from './styles';

export function BackHeader({ navigation, route, options, back }: StackHeaderProps) {
  return (
    <Box style={styles.backHeader}>
      <BackButton onPress={navigation.goBack} />
    </Box>
  )
}
