import { View } from "react-native"

import styles from './styles/shared';
import EmojiProgressCircle from "./EmojiProgressCircle"
import { Text } from "@ledget/native-ui";

const PickerOption = () => {
  return (
    <View style={styles.columns}>
      <View style={styles.row}>
        <EmojiProgressCircle progress={.6}>
          <Text>{'🌯'}</Text>
        </EmojiProgressCircle>
        <EmojiProgressCircle progress={.4}>
          <Text>{'🏠'}</Text>
        </EmojiProgressCircle>
      </View>
      <View style={styles.row}>
        <EmojiProgressCircle progress={.4}>
          <Text>{'👕'}</Text>
        </EmojiProgressCircle>
        <EmojiProgressCircle progress={.6}>
          <Text>{'🍹'}</Text>
        </EmojiProgressCircle>
      </View>
    </View>
  )
}

export default PickerOption
