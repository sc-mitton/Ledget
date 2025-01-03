import { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'geist-native-icons';
import dayjs from 'dayjs';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Filter2 } from '@ledget/media/native';
import styles from './styles/history';
import {
  BottomDrawerModal,
  CustomScrollView,
  InstitutionLogo,
  Text,
  DollarCents,
  Icon,
  Seperator,
  Spinner,
  Button,
  Box,
} from '@ledget/native-ui';
import {
  selectFilteredFetchedConfirmedTransactions,
  Transaction,
  useLazyGetTransactionsQuery,
  selectCurrentBudgetWindow,
  selectConfirmedTransactionFilter,
} from '@ledget/shared-features';
import { useAppearance } from '@features/appearanceSlice';
import { formatDateOrRelativeDate } from '@ledget/helpers';
import { useAppSelector } from '@hooks';
import { ModalScreenProps } from '@types';
import { EmptyBox } from '@ledget/media/native';
import HistoryFilters from './HistoryFilters';

const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  return (
    <View style={styles.transaction}>
      <View style={styles.logoContainer}>
        <InstitutionLogo account={transaction.account} size={30} />
      </View>
      <View style={styles.leftColumn}>
        <Text>
          {transaction.name.length > 20
            ? `${transaction.name.slice(0, 20)} ...`
            : transaction.name}
        </Text>
        <View style={styles.leftColumnBottomRow}>
          <Box style={styles.emojis}>
            {[...(transaction.categories || []), transaction.bill].map(
              (i) =>
                i && (
                  <Box style={styles.emojiContainer}>
                    <Text style={styles.emoji}>{i.emoji}</Text>
                  </Box>
                )
            )}
          </Box>
          <Text color="tertiaryText">
            {formatDateOrRelativeDate(
              dayjs(transaction.datetime! || transaction.date).valueOf()
            )}
          </Text>
        </View>
      </View>
      <View style={styles.dateColumn}>
        <DollarCents value={transaction.amount} />
      </View>
      <View>
        <Icon icon={ChevronRight} color={'quinaryText'} />
      </View>
    </View>
  );
};

const Transactions = (
  props: ModalScreenProps<'Activity'> & {
    showFilters: React.Dispatch<React.SetStateAction<boolean>>;
  }
) => {
  const { mode } = useAppearance();
  const { start, end } = useAppSelector(selectCurrentBudgetWindow);

  const transactionsData = useAppSelector(
    selectFilteredFetchedConfirmedTransactions
  );
  const [
    getTransactions,
    { isLoading: isLoadingTransactions, isSuccess: isTransactionsSuccess },
  ] = useLazyGetTransactionsQuery();

  // Initial transaction fetch
  useEffect(() => {
    if (!start || !end) return;
    getTransactions({ confirmed: true, start, end }, true);
  }, [start, end]);

  return (
    <>
      {transactionsData.length === 0 ? (
        <View style={styles.emptyBoxGraphic}>
          {isLoadingTransactions ? (
            <Spinner color="mainText" />
          ) : isTransactionsSuccess ? (
            <EmptyBox dark={mode === 'dark'} />
          ) : null}
        </View>
      ) : (
        <CustomScrollView
          stickyHeaderIndices={[0]}
          scrollIndicatorInsets={{ right: -8 }}
          style={styles.scrollView}
        >
          <View>
            <View style={styles.filterButtonContainer}>
              <Button
                shadowColor="modalBox"
                onPress={() => props.showFilters(true)}
                shadowOffset={{ width: 0, height: 0 }}
                shadowOpacity={1}
                shadowRadius={12}
                padding="s"
                labelPlacement="left"
                fontSize={14}
                borderRadius={'m'}
                backgroundColor="mediumGrayButton"
                textColor="secondaryText"
              >
                <Icon
                  icon={Filter2}
                  color="secondaryText"
                  size={18}
                  strokeWidth={2}
                />
              </Button>
            </View>
          </View>
          {transactionsData.map((transaction, index) => (
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.touchableTransacton}
                onPress={() =>
                  props.navigation.navigate('Accounts', {
                    screen: 'Transaction',
                    params: { transaction },
                    initial: false,
                  })
                }
                activeOpacity={0.7}
              >
                <TransactionRow
                  key={transaction.transaction_id}
                  transaction={transaction}
                />
              </TouchableOpacity>
              <View style={styles.seperatorContainer}>
                <Seperator
                  backgroundColor={
                    index === transactionsData.length - 1
                      ? 'transparent'
                      : 'modalSeperator'
                  }
                />
              </View>
            </View>
          ))}
        </CustomScrollView>
      )}
    </>
  );
};

const History = (props: ModalScreenProps<'Activity'>) => {
  const [showFilters, setShowFilters] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const filter = useAppSelector(selectConfirmedTransactionFilter);
  const transactionsData = useAppSelector(
    selectFilteredFetchedConfirmedTransactions
  );
  const [getTransactions, { isSuccess: isTransactionsSuccess }] =
    useLazyGetTransactionsQuery();

  // Initial transaction fetch
  useEffect(() => {
    if (!filter) return;
    getTransactions(filter, true);
  }, [filter]);

  useEffect(() => {
    if (collapsed) {
      props.navigation.goBack();
    }
  }, [collapsed]);

  const onClose = useCallback(() => {
    props.navigation.goBack();
  }, []);

  return (
    <BottomDrawerModal.Content
      defaultExpanded={isTransactionsSuccess && transactionsData.length > 0}
      onExpand={() => setCollapsed(false)}
      onCollapse={() => setCollapsed(true)}
      onClose={onClose}
    >
      {showFilters ? (
        <Animated.View
          exiting={FadeOut}
          entering={FadeIn}
          style={styles.animatedView}
        >
          <HistoryFilters showFilters={setShowFilters} />
        </Animated.View>
      ) : (
        <Animated.View
          exiting={FadeOut}
          entering={FadeIn}
          style={styles.animatedView}
        >
          <Transactions {...props} showFilters={setShowFilters} />
        </Animated.View>
      )}
    </BottomDrawerModal.Content>
  );
};

export default History;
