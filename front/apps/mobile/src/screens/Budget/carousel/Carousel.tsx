import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import Big from 'big.js';

import styles from './styles';
import sharedStyles from '../styles/shared-styles';
import { CarouselDots, Text, DollarCents, PagerView } from '@ledget/native-ui';
import {
  selectCategoryMetaData,
  selectBillMetaData,
  useGetCategoriesQuery,
  useGetBillsQuery,
  selectBudgetMonthYear
} from '@ledget/shared-features';
import { useAppSelector } from '@/hooks';
import { useAppearance } from '@/features/appearanceSlice';

const INITIAL_HEIGHT = 50;

const Carousel = () => {
  const { mode } = useAppearance();
  const [page, setPage] = useState(0);
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const height = useSharedValue(INITIAL_HEIGHT);

  const { isLoading: loadingCategories } = useGetCategoriesQuery(
    { month, year },
    { skip: !month || !year }
  );
  const { isLoading: loadingBills } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  );
  const {
    monthly_spent,
    yearly_spent,
    limit_amount_monthly,
    limit_amount_yearly
  } = useAppSelector(selectCategoryMetaData);
  const {
    monthly_bills_paid,
    yearly_bills_paid,
    number_of_monthly_bills,
    number_of_yearly_bills
  } = useAppSelector(selectBillMetaData);

  return (
    <Animated.View style={[styles.container, { height }]} >
      <PagerView
        style={sharedStyles.pagerView}
        initialPage={page}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        <View style={styles.page} key='1'>
          <View
            style={styles.measuringPage}
            onLayout={(e) => {
              if (e.nativeEvent.layout.height > height.value)
                height.value = e.nativeEvent.layout.height;
            }}
          >
            <DollarCents
              variant={mode === 'light' ? 'bold' : 'regular'}
              fontSize={36}
              value={loadingCategories || loadingBills
                ? 0
                : Big(yearly_spent).add(monthly_spent).toNumber()}
            />
            <Text color='secondaryText'>
              total spending
            </Text>
          </View>
        </View>
        <View style={styles.page} key='2'>
          <DollarCents
            variant={mode === 'light' ? 'bold' : 'regular'}
            fontSize={32}
            value={Big(limit_amount_monthly).minus(monthly_spent).toNumber()}
          />
          <Text color='secondaryText'>
            remaining monthly spending
          </Text>
        </View>
        <View style={styles.page} key='3'>
          <DollarCents
            variant={mode === 'light' ? 'bold' : 'regular'}
            fontSize={32}
            value={Big(limit_amount_yearly).minus(yearly_spent).toNumber()}
          />
          <Text color='secondaryText'>
            remaining yearly spending
          </Text>
        </View>
        <View style={styles.page} key='4'>
          <View style={styles.measuringPage}>
            <Text fontSize={32} lineHeight={44} variant={mode === 'light' ? 'bold' : 'regular'}>
              {monthly_bills_paid + yearly_bills_paid} / {number_of_monthly_bills + number_of_yearly_bills}
            </Text>
            <Text color='secondaryText'>
              bills paid
            </Text>
          </View>
        </View>
      </PagerView>
      <View style={styles.carouselDotsContainer}>
        <CarouselDots length={4} currentIndex={page} />
      </View>
    </Animated.View>
  )
}

export default Carousel;
