import { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'geist-native-icons';
import dayjs from 'dayjs';

import styles from './styles/history';
import {
  BottomDrawerModal,
  CustomScrollView,
  InstitutionLogo,
  Text,
  DollarCents,
  Icon,
  Seperator
} from '@ledget/native-ui';
import {
  selectFilteredFetchedConfirmedTransactions,
  Transaction,
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  selectCurrentBudgetWindow,
} from '@ledget/shared-features';
import { formatDateOrRelativeDate } from '@ledget/helpers';
import { useAppSelector, useAppDispatch } from '@hooks';
import { ModalScreenProps } from '@types';

const Filter = () => {
  return (
    <View></View>
  )
}

const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  return (
    <View style={styles.transaction}>
      <View style={styles.logoContainer}>
        <InstitutionLogo account={transaction.account} />
      </View>
      <View style={styles.leftColumn}>
        <Text>{transaction.name.length > 20 ? `${transaction.name.slice(0, 20)} ...` : transaction.name}</Text>
        <View style={styles.leftColumnBottomRow}>
          <Text color='secondaryText'>
            {formatDateOrRelativeDate(dayjs(transaction.datetime! || transaction.date).valueOf())}
          </Text>
          <View style={styles.emojis}>
            {[...(transaction.categories || []), transaction.bill].map(i =>
              i && <Text>{i.emoji}</Text>)}
          </View>
        </View>
      </View>
      <View style={styles.dateColumn}>
        <DollarCents value={transaction.amount} />
      </View>
      <View>
        <Icon icon={ChevronRight} color={'quinaryText'} />
      </View>
    </View>
  )
}

const History = (props: ModalScreenProps<'Activity'>) => {
  const [isFetchingMore, setFetchingMore] = useState(false);
  const { start, end } = useAppSelector(selectCurrentBudgetWindow);
  const { isError } = useGetTransactionsQuery(
    { confirmed: true, start, end },
    { skip: !start || !end }
  );
  const transactionsData = useAppSelector(
    selectFilteredFetchedConfirmedTransactions
  );
  const dispatch = useAppDispatch();
  const [getTransactions, { data: fetchedTransactionData, isLoading }] =
    useLazyGetTransactionsQuery();
  let monthholder: number | undefined;
  let newMonth = false;

  // Initial transaction fetch
  useEffect(() => {
    if (!start || !end) return;
    getTransactions({ confirmed: true, start, end }, true);
  }, [start, end]);

  // Refetches for pagination
  const handleScroll = (e: any) => {
    setFetchingMore(true);
    const bottom = e.target.scrollTop === e.target.scrollTopMax;
    // Update cursors to add new transactions node to the end
    if (bottom && fetchedTransactionData?.next) {
      getTransactions({
        confirmed: true,
        offset: fetchedTransactionData.next,
        limit: fetchedTransactionData.limit,
        start,
        end
      });
    }
    setFetchingMore(false);
  };

  return (
    <BottomDrawerModal.Content>
      <CustomScrollView scrollIndicatorInsets={{ right: -8 }} style={styles.scrollView}>
        {transactionsData.map((transaction, index) =>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.touchableTransacton}
              onPress={() => props.navigation.navigate('TransactionDetails', { transaction })}
              activeOpacity={.7}>
              <TransactionRow
                key={transaction.transaction_id}
                transaction={transaction} />
            </TouchableOpacity>
            <View style={styles.seperatorContainer}>
              {index !== transactionsData.length - 1 && <Seperator />}
            </View>
          </View>
        )}
      </CustomScrollView>
    </BottomDrawerModal.Content>
  )
}

export default History
