import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import dayjs from 'dayjs';

import sharedStyles from '../styles/shared-styles';
import { Box, BoxHeader, Seperator, Text, CarouselDots, TPagerViewRef, PagerView } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { selectBudgetMonthYear } from '@ledget/shared-features';
import { BudgetScreenProps } from '@types';
import List from './List';
import Calendar from './Calendar';

const Bills = (props: BudgetScreenProps<'Main'>) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [index, setIndex] = useState(0);
  const ref = useRef<TPagerViewRef>(null);

  useEffect(() => {
    ref.current?.setPage(index);
  }, [index]);

  return (
    <View style={sharedStyles.section}>
      <BoxHeader>Bills</BoxHeader>
      <Box variant='nestedContainer' style={sharedStyles.box}>
        <Box style={sharedStyles.carouselDots} backgroundColor='nestedContainer'>
          <CarouselDots length={2} currentIndex={index} />
        </Box>
        <PagerView
          ref={ref}
          style={sharedStyles.pagerView}
          initialPage={index}
          onPageSelected={(e) => setIndex(e.nativeEvent.position)}
        >
          <View style={sharedStyles.page} key='1'>
            <Text>{dayjs(`${year}-${month}-01`).format('MMM YYYY')}</Text>
            <Seperator backgroundColor='nestedContainerSeperator' />
            <List {...props} />
          </View>
          <View style={sharedStyles.page} key='2'>
            <Calendar {...props} onPress={() => setIndex(0)} />
          </View>
        </PagerView>
      </Box>
    </View>
  )
}

export default Bills;
