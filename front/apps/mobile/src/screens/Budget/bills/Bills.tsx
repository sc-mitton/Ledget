import { useState } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import dayjs from 'dayjs';

import sharedStyles from '../styles/shared-styles';
import { Box, BoxHeader, Seperator, Text, CarouselDots } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { selectBudgetMonthYear } from '@ledget/shared-features';
import List from './List';

const Bills = () => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [index, setIndex] = useState(0);

  return (
    <View style={sharedStyles.section}>
      <BoxHeader>Bills</BoxHeader>
      <Box variant='nestedContainer' style={sharedStyles.box}>
        <Box style={sharedStyles.carouselDots}>
          <CarouselDots length={2} currentIndex={index} />
        </Box>
        <PagerView
          style={sharedStyles.pagerView}
          initialPage={index}
          orientation={'horizontal'}
          onPageSelected={(e) => setIndex(e.nativeEvent.position)}
        >
          <View style={sharedStyles.page} key='1'>
            <Text>
              {dayjs(`${year}-${month}-01`).format('MMM YYYY')}
            </Text>
            <Seperator backgroundColor='nestedContainerSeperator' />
            <List period='month' />
          </View>
          <View style={sharedStyles.page} key='2'>
          </View>
        </PagerView>
      </Box>
    </View>
  )
}

export default Bills;
