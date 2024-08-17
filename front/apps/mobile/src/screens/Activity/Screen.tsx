import { View } from 'react-native';

import styles from './styles';
import { Box, Header } from '@ledget/native-ui';

const Screen = () => {
  return (
    <View style={styles.bottomModal}>
      <Box
        backgroundColor='modalBox'
        shadowColor='navShadow'
        shadowOpacity={0.5}
        shadowRadius={10}
        shadowOffset={{ width: 0, height: -4 }}
      >
        <Header>Activity</Header>
      </Box>
    </View>
  )
}

export default Screen
