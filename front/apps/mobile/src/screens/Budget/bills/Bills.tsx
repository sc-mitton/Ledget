import { useEffect, useRef, useState, memo } from 'react';
import { View } from 'react-native';
import { LinearTransition } from 'react-native-reanimated';

import styles from './styles/bills';
import sharedStyles from '../styles/shared-styles';
import { Box, TPagerViewRef, PagerView } from '@ledget/native-ui';
import { BudgetScreenProps } from '@types';
import List from './List';
import Calendar from './Calendar';
import { useBudgetContext } from '../context';
import { useLoaded } from '@ledget/helpers';

const Bills = (props: BudgetScreenProps<'Main'>) => {
  const loaded = useLoaded();
  const [index, setIndex] = useState(0);
  const ref = useRef<TPagerViewRef>(null);
  const { setBillsIndex } = useBudgetContext();

  useEffect(() => {
    ref.current?.setPage(index);
    setBillsIndex(index);
  }, [index]);

  return (
    <Box
      paddingBottom='nestedContainerHPadding'
      paddingHorizontal='nestedContainerHPadding'
      backgroundColor='nestedContainer'
      style={sharedStyles.boxBottomHalf}
      layout={LinearTransition}
    >
      <PagerView
        ref={ref}
        style={sharedStyles.pagerView}
        initialPage={index}
        onPageSelected={(e) => setIndex(e.nativeEvent.position)}
      >
        <View style={sharedStyles.page} key='1'>
          <View style={styles.billsList}>
            <List {...props} />
          </View>
        </View>
        <View style={sharedStyles.page} key='2'>
          <Calendar {...props} onPress={() => setIndex(0)} />
        </View>
      </PagerView>
    </Box>
  )
}

export default memo(Bills);
