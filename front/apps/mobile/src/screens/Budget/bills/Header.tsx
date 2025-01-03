import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearTransition } from 'react-native-reanimated';
import dayjs from 'dayjs';

import styles from './styles/header';
import sharedStyles from '../styles/shared-styles';
import { selectBudgetMonthYear } from '@ledget/shared-features';
import { Box, CarouselDots, Seperator, Text } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { useBudgetContext } from '../context';

const Header = () => {
  const { billsIndex } = useBudgetContext();
  const { month, year } = useAppSelector(selectBudgetMonthYear);

  return (
    <>
      <Box
        backgroundColor="mainBackground"
        layout={LinearTransition}
        style={[StyleSheet.absoluteFill, styles.backPanel]}
      />
      <Box
        paddingTop="nestedContainerHPadding"
        paddingHorizontal="nestedContainerHPadding"
        backgroundColor="nestedContainer"
        layout={LinearTransition}
        style={sharedStyles.boxTopHalf}
      >
        <View style={sharedStyles.carouselDots}>
          <CarouselDots length={2} currentIndex={billsIndex} />
        </View>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            {billsIndex === 0 ? (
              <Text fontSize={18}>Bills</Text>
            ) : (
              <Text fontSize={18}>
                {dayjs(`${year}-${month}-01`).format('MMMM YYYY')}
              </Text>
            )}
          </View>
          <View style={styles.seperator}>
            <Seperator
              backgroundColor="nestedContainerSeperator"
              variant="bare"
            />
          </View>
        </View>
      </Box>
    </>
  );
};
export default memo(Header);
