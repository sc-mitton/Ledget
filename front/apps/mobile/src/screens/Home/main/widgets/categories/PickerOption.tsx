import { View } from 'react-native';

import styles from './styles/shared';
import EmojiProgressCircle from './EmojiProgressCircle';
import { Text } from '@ledget/native-ui';

const PickerOption = ({ loading }: { loading: boolean }) => {
  return (
    <View style={styles.columns}>
      <View style={styles.row}>
        <EmojiProgressCircle progress={0.6}>
          {!loading && <Text>{'🌯'}</Text>}
        </EmojiProgressCircle>
        <EmojiProgressCircle progress={0.4}>
          {!loading && <Text>{'🏠'}</Text>}
        </EmojiProgressCircle>
      </View>
      <View style={styles.row}>
        <EmojiProgressCircle progress={0.4}>
          {!loading && <Text>{'👕'}</Text>}
        </EmojiProgressCircle>
        <EmojiProgressCircle progress={0.6}>
          {!loading && <Text>{'🍹'}</Text>}
        </EmojiProgressCircle>
      </View>
    </View>
  );
};

export default PickerOption;
