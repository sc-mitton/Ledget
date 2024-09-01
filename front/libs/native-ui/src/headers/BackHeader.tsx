import { StackHeaderProps } from '@react-navigation/stack';
import { View } from 'react-native';

import styles from './styles';
import { Box } from '../restyled/Box';
import { BackButton } from '../buttons/back-button/BackButton';
import { Text } from '../restyled/Text';
import { Seperator } from '../restyled/Seperator';

export function BackHeader({ navigation, route, options, back, pagesWithTitle }: StackHeaderProps & { pagesWithTitle?: string[] }) {

  return (
    <Box style={[styles.headerContainer]} backgroundColor='mainBackground' >
      <Box style={styles.backButton}>
        <BackButton onPress={(e) => {
          e.preventDefault();
          navigation.goBack();
        }} />
      </Box>
      {pagesWithTitle?.includes(route.name) &&
        <>
          <Text fontSize={19} style={styles.title}>
            {route.name}
          </Text>
          <View style={styles.seperator}>
            <Seperator backgroundColor='darkerseperator' variant='bare' />
          </View>
        </>}
    </Box>
  )
}
