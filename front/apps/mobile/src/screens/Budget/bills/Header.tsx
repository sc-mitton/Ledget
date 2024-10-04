import { View, StyleSheet } from 'react-native';

import styles from './styles/header';
import sharedStyles from '../styles/shared-styles';
import { Box, CarouselDots, Seperator, Text } from '@ledget/native-ui';

const Header = ({ index }: { index: number }) => {
  return (
    <View>
      <Box backgroundColor='mainBackground' style={[StyleSheet.absoluteFill, styles.backPanel]} />
      <Box
        paddingTop='nestedContainerVPadding'
        paddingHorizontal='nestedContainerHPadding'
        backgroundColor='nestedContainer'
        style={sharedStyles.boxTopHalf}
      >
        <View style={sharedStyles.carouselDots}>
          <CarouselDots length={2} currentIndex={index} />
        </View>
        <View style={styles.header}>
          <Text color='secondaryText'>Bills</Text>
          <View style={styles.seperator}>
            <Seperator backgroundColor='nestedContainerSeperator' variant='bare' />
          </View>
        </View>
      </Box>
    </View>
  )
}
export default Header
