import { View, Text } from "react-native"

import styles from './styles/shared';
import EmojiProgressCircle from "./EmojiProgressCircle"

const Shadow = () => {

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

export default Shadow
