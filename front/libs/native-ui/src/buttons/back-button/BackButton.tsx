import { TouchableOpacity, View, GestureResponderEvent } from 'react-native';

import styles from './styles';
import { Text } from '../../restyled/Text';
import { ChevronLeft } from 'geist-native-icons';
import { useTheme } from '@shopify/restyle';

export const BackButton = ({
  onPress,
  label,
}: {
  onPress: (e: GestureResponderEvent) => void;
  label?: string;
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.5}
    >
      <View style={styles.chevronContainer}>
        <ChevronLeft
          stroke={theme.colors.blueText}
          size={28}
          strokeWidth={1.75}
        />
      </View>
      <Text color={'blueText'} fontSize={19}>
        {label ? label : 'back'}
      </Text>
    </TouchableOpacity>
  );
};
