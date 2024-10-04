import { useState } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { CheckCircle } from 'geist-native-icons';
import Big from 'big.js';

import styles from './styles';
import sharedStyles from '../styles/shared-styles';
import { CarouselDots, Text, DollarCents, PagerView, Box, Icon } from '@ledget/native-ui';
import {
  selectCategoryMetaData,
  selectBillMetaData,
  useGetCategoriesQuery,
  useGetBillsQuery,
  selectBudgetMonthYear
} from '@ledget/shared-features';
import { useAppSelector } from '@/hooks';

const INITIAL_HEIGHT = 50;
const FONT_SIZE = 40;

const Carousel = () => {
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
    <Box
      style={styles.container}
      borderRadius='l'
    >
      <Animated.View style={[styles.animatedView, { height }]} >
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
                variant={'bold'}
                fontSize={FONT_SIZE}
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
              variant={'bold'}
              fontSize={FONT_SIZE}
              value={Big(limit_amount_monthly).minus(monthly_spent).toNumber()}
            />
            <View style={styles.row}>
              <Box backgroundColor='monthColor' style={styles.dot} />
              <Text color='secondaryText'>
                monthly spending left
              </Text>
            </View>
          </View>
          <View style={styles.page} key='3'>
            <DollarCents
              variant={'bold'}
              fontSize={FONT_SIZE}
              value={Big(limit_amount_yearly).minus(yearly_spent).toNumber()}
            />
            <View style={styles.row}>
              <Box backgroundColor='yearColor' style={styles.dot} />
              <Text color='secondaryText'>
                yearly spending left
              </Text>
            </View>
          </View>
          <View style={styles.page} key='4'>
            <View style={styles.measuringPage}>
              <Text fontSize={FONT_SIZE} lineHeight={0} variant='bold'>
                {monthly_bills_paid + yearly_bills_paid} / {number_of_monthly_bills + number_of_yearly_bills}
              </Text>
              <View style={styles.row}>
                <Icon
                  icon={CheckCircle}
                  strokeWidth={2}
                  color={monthly_bills_paid + yearly_bills_paid > 0 ? 'greenText' : 'secondaryText'}
                />
                <Text color='secondaryText'>
                  bills paid
                </Text>
              </View>
            </View>
          </View>
        </PagerView>
        <Box
          backgroundColor='grayButton'
          style={styles.carouselDotsContainer}>
          <CarouselDots length={4} currentIndex={page} />
        </Box>
      </Animated.View>
    </Box>
  )
}

export default Carousel;
