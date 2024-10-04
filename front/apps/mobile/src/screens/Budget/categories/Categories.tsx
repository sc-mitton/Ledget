import { useEffect, useState } from 'react';
import { View } from 'react-native';

import sharedStyles from '../styles/shared-styles';
import { Box, PagerView } from '@ledget/native-ui';
import List from './List';
import { BudgetScreenProps } from '@types';

const Categories = (props: BudgetScreenProps<'Main'> & { setIndex: (n: number) => void }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    props.setIndex(index)
  }, [index])

  return (
    <Box
      paddingBottom='nestedContainerHPadding'
      paddingHorizontal='nestedContainerHPadding'
      backgroundColor='nestedContainer'
      style={sharedStyles.boxBottomHalf}
    >
      <PagerView
        pageMargin={24}
        style={sharedStyles.pagerView}
        initialPage={index}
        onPageSelected={(e) => setIndex(e.nativeEvent.position)}
      >
        <View style={sharedStyles.page} key='1'>
          <List period='month' {...props} />
        </View>
        <View style={sharedStyles.page} key='2'>
          <List period='year' {...props} />
        </View>
      </PagerView>
    </Box>
  )
}

export default Categories;
