import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import styles from './styles/bills';
import sharedStyles from '../styles/shared-styles';
import { Box, CarouselDots, TPagerViewRef, PagerView } from '@ledget/native-ui';
import { BudgetScreenProps } from '@types';
import List from './List';
import Calendar from './Calendar';

const Bills = (props: BudgetScreenProps<'Main'> & { setIndex: (index: number) => void }) => {
  const [index, setIndex] = useState(0);
  const ref = useRef<TPagerViewRef>(null);

  useEffect(() => {
    ref.current?.setPage(index);
    props.setIndex(index);
  }, [index]);

  return (
    <Box variant='nestedContainer' style={sharedStyles.box}>
      <PagerView
        ref={ref}
        style={sharedStyles.pagerView}
        initialPage={index}
        onPageSelected={(e) => setIndex(e.nativeEvent.position)}
      >
        <View style={sharedStyles.page} key='1'>
          <View style={styles.billsList}>
            {Array.from({ length: 12 }).map((_, i) => (
              <List {...props} />
            ))}
          </View>
        </View>
        <View style={sharedStyles.page} key='2'>
          <Calendar {...props} onPress={() => setIndex(0)} />
        </View>
      </PagerView>
    </Box>
  )
}

export default Bills;
