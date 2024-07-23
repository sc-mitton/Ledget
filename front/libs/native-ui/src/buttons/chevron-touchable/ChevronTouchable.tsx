import { TouchableOpacity, View } from "react-native";

import styles from './styles';
import { Icon } from "../../restyled/Icon";
import { ChevronDown, ChevronRight } from "geist-native-icons";

interface Props {
  direction?: 'right' | 'down';
  onPress?: () => void;
  children?: React.ReactNode;
}

export const ChevronTouchable = ({ direction = 'right', onPress, children }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.6}>
      {children}
      <View style={styles.chevron}>
        <Icon icon={direction === 'right' ? ChevronRight : ChevronDown} color='quinaryText' />
      </View>
    </TouchableOpacity>
  );
}
