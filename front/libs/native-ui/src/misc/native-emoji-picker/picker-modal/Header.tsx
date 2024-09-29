import { View } from 'react-native';

import styles from './styles/header';
import { Text } from '../../../restyled/Text';
import { Button } from '../../../restyled/Button';
import { Seperator } from '../../../restyled/Seperator';

const Header = (props: { title?: string, onClose?: () => void, onRemove?: () => void }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Button label='Remove' textColor='blueText' onPress={props.onRemove} />
        <View style={styles.titleContainer}>
          <View style={styles.title}>
            <Text>{props.title}</Text>
          </View>
        </View>
        <Button label='Close' textColor='blueText' onPress={props.onClose} />
      </View>
      <View style={styles.seperator}>
        <Seperator backgroundColor='modalSeperator' />
      </View>
    </View>
  )
}
export default Header
