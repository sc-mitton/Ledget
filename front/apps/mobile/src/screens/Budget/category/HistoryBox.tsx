import { useEffect } from 'react'
import { TouchableOpacity, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import { ChevronRight } from 'geist-native-icons'
import { Big } from 'big.js'
import { Clock } from 'geist-native-icons'
import dayjs from 'dayjs'

import styles from './styles/history-box'
import { useLazyGetTransactionsQuery } from '@ledget/shared-features'
import { Box, DollarCents, Text, CustomScrollView, Icon, BoxHeader } from '@ledget/native-ui'
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
    <View style={styles.historyBoxContainer}>
      <BoxHeader>
        <View style={styles.clockIcon}>
          <Icon icon={Clock} size={16} color='tertiaryText' />
        </View>
        Spending History
      </BoxHeader>
      <Box
        variant='nestedContainer'
        style={styles.transactionsListBox}
      >
        <CustomScrollView onScroll={handleScroll} contentContainerStyle={styles.transactionsList}>
          {transactionsData?.results.map((transaction) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => props.navigation.navigate('Transaction', { transaction })}>
              <View>
                <Text>{transaction.name}</Text>
                <Text color='tertiaryText'>{dayjs(transaction.date).format('MM-DD-YYYY')}</Text>
              </View>
              <View style={styles.amountContainer}>
                <DollarCents value={Big(transaction.amount).times(100).toNumber()} />
                <Icon icon={ChevronRight} color='quinaryText' />
              </View>
            </TouchableOpacity>))}
        </CustomScrollView>
        {transactionsData?.results.length === 0 && (
          <View style={styles.emptyListMessage}>
            <Text color='quinaryText'>No spending yet</Text>
          </View>
        )}
      </Box>
    </View>
  )
}
export default HistoryBox
