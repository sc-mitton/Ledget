import { useEffect } from 'react'
import { TouchableOpacity, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import { ChevronRight } from 'geist-native-icons'
import { Big } from 'big.js'
import dayjs from 'dayjs'

import styles from './styles/history-box'
import SkeletonList from '../SkeletonList/SkeletonList'
import { useLazyGetTransactionsQuery } from '@ledget/shared-features'
import { Box, DollarCents, Text, CustomScrollView, Icon } from '@ledget/native-ui'
import { useAppSelector } from '@hooks'
import { selectBudgetMonthYear } from '@ledget/shared-features'
import { BudgetScreenProps } from '@types'

const HistoryBox = (props: BudgetScreenProps<'Category'>) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [getTransactions, { data: transactionsData }] = useLazyGetTransactionsQuery();

  // Initial fetching Transactions
  useEffect(() => {
    if (month && year) {
      getTransactions(
        {
          confirmed: true,
          ...(props.route.params.category.period === 'month' ? { month, year } : { year }),
          category: props.route.params.category.id
        },
        true
      );
    }
  }, [month, year]);

  // Fetch more transactions
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // If at the bottom of the scroll view, fetch more transactions
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent
    const bottom = contentOffset.y + layoutMeasurement.height >= contentSize.height

    if (bottom && transactionsData?.next !== null && transactionsData) {
      getTransactions({
        confirmed: true,
        ...(props.route.params.category.period === 'month' ? { month, year } : { year }),
        offset: transactionsData.next,
        limit: transactionsData.limit
      });
    }
  };

  return (
    <>

      <Box variant='nestedContainer' style={styles.transactionsListBox}>
        {transactionsData?.results
          ?
          <CustomScrollView
            peekabooScrollIndicator={transactionsData?.results.length === 0}
            onScroll={handleScroll}
            contentContainerStyle={styles.transactionsList}
          >
            {transactionsData?.results.map((transaction) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => props.navigation.navigate('Transaction', { transaction })}>
                <View>
                  <Text>
                    {transaction.name.length > 20
                      ? `${transaction.name.slice(0, 20)}...`
                      : transaction.name}
                  </Text>
                  <Text color='tertiaryText'>{dayjs(transaction.date).format('M-DD-YYYY')}</Text>
                </View>
                <View style={styles.amountContainer}>
                  <DollarCents value={Big(transaction.amount).times(100).toNumber()} />
                  <Icon icon={ChevronRight} color='quinaryText' />
                </View>
              </TouchableOpacity>))}
          </CustomScrollView>
          :
          <SkeletonList />
        }
        {transactionsData?.results.length === 0 && (
          <View style={styles.emptyListMessage}>
            <Text color='quinaryText'>No spending yet</Text>
          </View>
        )}
      </Box>
    </>
  )
}
export default HistoryBox
