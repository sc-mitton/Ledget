import { StackHeaderProps } from '@react-navigation/stack';
import { NativeModules, View } from 'react-native';

import styles from './styles/header';
import { Box, BackButton } from '@ledget/native-ui';

const { StatusBarManager } = NativeModules;

function BackHeader(props: StackHeaderProps) {
  const { navigation } = props;

  return (
    <Box
      style={[
        styles.headerContainer,
        { top: StatusBarManager.HEIGHT + 8 }
      ]}
    >
      <Box style={styles.backButton}>
        <BackButton onPress={(e) => {
          e.preventDefault();
          navigation.goBack();
        }} />
      </Box>
      <View>

      </View>
    </Box>
  )
}

export default BackHeader;
