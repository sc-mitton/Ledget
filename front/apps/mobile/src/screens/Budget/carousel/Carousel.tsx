import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { CheckCircle } from 'geist-native-icons';
import Big from 'big.js';

import styles from './styles';
import { Text, DollarCents, Box, Icon } from '@ledget/native-ui';
import {
  selectCategoryMetaData,
  selectBillMetaData,
  useGetCategoriesQuery,
  useGetBillsQuery,
  selectBudgetMonthYear
} from '@ledget/shared-features';
import { useAppSelector } from '@/hooks';

const INITIAL_HEIGHT = 50;
const FONT_SIZE = 24;

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
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        horizontal
      >
        <Box variant='lightGrayCard'>
          <DollarCents
            withCents={false}
            variant={'bold'}
            fontSize={FONT_SIZE}
            value={loadingCategories || loadingBills
              ? 0
              : Big(yearly_spent).add(monthly_spent).toNumber()}
          />
          <View style={styles.row}>
            <Box
              backgroundColor='monthColor'
              borderColor='mainBackground'
              borderWidth={1.5}
              style={styles.dot}
            />
            <View style={styles.overlappingDot}>
              <Box
                backgroundColor='yearColor'
                borderColor='mainBackground'
                borderWidth={1.5}
                style={styles.dot}
              />
            </View>
            <Text color='secondaryText' fontSize={15} >total spending</Text>
          </View>
        </Box>
        <Box variant='lightGrayCard'>
          <DollarCents
            withCents={false}
            variant={'bold'}
            fontSize={FONT_SIZE}
            value={Big(limit_amount_monthly).minus(monthly_spent).toNumber()}
          />
          <View style={styles.row}>
            <Box
              backgroundColor='monthColor'
              borderColor='mainBackground'
              borderWidth={1.5}
              style={styles.dot}
            />
            <Text color='secondaryText' fontSize={15} >monthly spending left</Text>
          </View>
        </Box>
        <Box variant='lightGrayCard'>
          <DollarCents
            variant={'bold'}
            withCents={false}
            fontSize={FONT_SIZE}
            value={Big(limit_amount_yearly).minus(yearly_spent).toNumber()}
          />
          <View style={styles.row}>
            <Box
              backgroundColor='yearColor'
              borderColor='mainBackground'
              borderWidth={1.5}
              style={styles.dot}
            />
            <Text color='secondaryText' fontSize={15} >yearly spending left</Text>
          </View>
        </Box>
        <Box variant='lightGrayCard'>
          <Text fontSize={FONT_SIZE} lineHeight={0} variant='bold'>
            {monthly_bills_paid + yearly_bills_paid} / {number_of_monthly_bills + number_of_yearly_bills}
          </Text>
          <View style={styles.row}>
            <Icon
              icon={CheckCircle}
              size={16}
              strokeWidth={2}
              color={monthly_bills_paid + yearly_bills_paid > 0 ? 'greenText' : 'secondaryText'}
            />
            <Text color='secondaryText' fontSize={15} >bills paid</Text>
          </View>
        </Box>
      </ScrollView>
    </Box>
  )
}

export default Carousel;
