import { TouchableOpacity } from "react-native";

import styles from './styles/shared';
import { ChevronRight } from "geist-native-icons";
import { Icon } from "@ledget/native-ui";

export const ChevronRightButton = ({ onPress }: { onPress: () => void }) => {

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={styles.editButton}>
      <Icon icon={ChevronRight} />
    </TouchableOpacity>
  )
}
