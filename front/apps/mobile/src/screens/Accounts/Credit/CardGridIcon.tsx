import { View } from 'react-native';
import styles from './styles/card-grid-icon';

import { Box } from '@ledget/native-ui';

const CardGridIcon = () => {
  return (
    <View>
      <View style={styles.cardIconRow}>
        <Box
          borderColor='quinaryText'
          backgroundColor='mainBackground'
          style={styles.cardIcon}
        />
        <Box
          borderColor='quinaryText'
          backgroundColor='mainBackground'
          style={styles.cardIcon}
        />
      </View>
      <View style={styles.cardIconRow}>
        <Box
          borderColor='quinaryText'
          backgroundColor='mainBackground'
          style={styles.cardIcon}
        />
        <Box
          borderColor='quinaryText'
          backgroundColor='mainBackground'
          style={styles.cardIcon}
        />
      </View>
    </View>
  )
}

export default CardGridIcon;
