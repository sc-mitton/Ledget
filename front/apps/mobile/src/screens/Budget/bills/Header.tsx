import { View, StyleSheet } from 'react-native';

import styles from './styles/header';
import sharedStyles from '../styles/shared-styles';
import { Box, CarouselDots, Seperator, Text } from '@ledget/native-ui';

const Header = ({ index }: { index: number }) => {
  return (
    <View style={[styles.headerContainer]}>
      <Box backgroundColor='mainBackground' style={[StyleSheet.absoluteFill, styles.backPanel]} />
      <Box variant='nestedContainer'>
        <Box style={sharedStyles.carouselDots} backgroundColor='nestedContainer'>
          <CarouselDots length={2} currentIndex={index} />
        </Box>
        <View style={styles.header}>
          <Text color='secondaryText'>Bills</Text>
          <Seperator backgroundColor='nestedContainerSeperator' />
        </View>
      </Box>
    </View>
  )
}
export default Header
