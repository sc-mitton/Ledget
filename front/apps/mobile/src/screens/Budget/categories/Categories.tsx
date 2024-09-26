import { useState } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';

import styles from './styles/categories';
import sharedStyles from '../styles/shared-styles';
import { useAppSelector } from '@/hooks';
import { selectCategoryMetaData, Category } from '@ledget/shared-features';
import { Box, BoxHeader, CarouselDots, DollarCents, Text } from '@ledget/native-ui';
import List from './List';

const Progress = ({ period }: { period: Category['period'] }) => {
  const {
    monthly_spent,
    yearly_spent,
    limit_amount_monthly,
    limit_amount_yearly
  } = useAppSelector(selectCategoryMetaData);

  return (
    <View>
      <View style={styles.progressHeader}>
        <DollarCents
          value={period === 'month' ? monthly_spent : yearly_spent}
          color={period === 'month' ? 'monthColor' : 'yearColor'}
          withCents={false}
        />
        <Text color={period === 'month' ? 'monthColor' : 'yearColor'}>
          spent of
        </Text>
        <DollarCents
          value={period === 'month' ? limit_amount_monthly : limit_amount_yearly}
          color={period === 'month' ? 'monthColor' : 'yearColor'}
          withCents={false}
        />
      </View>
      <View style={styles.progressBarContainer}>
        <Box
          backgroundColor={period === 'month' ? 'monthColor' : 'yearColor'}
          style={[
            styles.progressBar,
            {
              width: period === 'month'
                ? `${(monthly_spent / limit_amount_monthly) * 100}%`
                : `${(yearly_spent / limit_amount_yearly) * 100}%`
            }
          ]}
        />
        <Box
          style={styles.progressBarBack}
          backgroundColor={period === 'month' ? 'monthColor' : 'yearColor'}
        />
      </View>
    </View>
  )
}

const Categories = () => {
  const [index, setIndex] = useState(0);

  return (
    <View style={sharedStyles.section}>
      <BoxHeader>Categories</BoxHeader>
      <Box variant='nestedContainer' style={sharedStyles.box}>
        <Box style={sharedStyles.carouselDots} backgroundColor='nestedContainer'>
          <CarouselDots length={2} currentIndex={index} />
        </Box>
        <PagerView
          pageMargin={24}
          style={sharedStyles.pagerView}
          initialPage={index}
          orientation={'horizontal'}
          onPageSelected={(e) => setIndex(e.nativeEvent.position)}
        >
          <View style={sharedStyles.page} key='1'>
            <Text>Monthly</Text>
            <Progress period='month' />
            <List period='month' />
          </View>
          <View style={sharedStyles.page} key='2'>
            <Text>Yearly</Text>
            <Progress period='year' />
            <List period='year' />
          </View>
        </PagerView>
      </Box>
    </View>
  )
}

export default Categories;
