import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearTransition } from 'react-native-reanimated';

import styles from './styles/header';
import sharedStyles from '../styles/shared-styles';
import { Box, CarouselDots, Seperator, Text } from '@ledget/native-ui';
import { useBudgetContext } from '../context';

const Header = () => {
  const { billsIndex } = useBudgetContext();

  return (
    <>
      <Box
        backgroundColor='mainBackground'
        layout={LinearTransition}
        style={[StyleSheet.absoluteFill, styles.backPanel]}
      />
      <Box
        paddingTop='nestedContainerVPadding'
        paddingHorizontal='nestedContainerHPadding'
        backgroundColor='nestedContainer'
        layout={LinearTransition}
        style={sharedStyles.boxTopHalf}
      >
        <View style={sharedStyles.carouselDots}>
          <CarouselDots length={2} currentIndex={billsIndex} />
        </View>
        <View style={styles.header}>
          <Text fontSize={18}>Bills</Text>
          <View style={styles.seperator}>
            <Seperator backgroundColor='nestedContainerSeperator' variant='bare' />
          </View>
        </View>
      </Box>
    </>
  )
}
export default memo(Header);
