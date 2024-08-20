import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { animated, useTransition, useSpringRef } from '@react-spring/native';
import dayjs from 'dayjs';

import styles from './styles/screen';
import TransactionItem from './TransactionItem';
import { useAppSelector } from '@hooks';
import {
  selectUnconfirmedTransactions,
  selectBudgetMonthYear,
  useLazyGetUnconfirmedTransactionsQuery
} from "@ledget/shared-features";
import { BottomDrawerModal } from '@ledget/native-ui';
import { useLoaded } from '@ledget/helpers';
import {
  _getY,
  _getScale,
  _getOpacity
} from './helpers';

const AnimatedTransactionContainer = animated(View);

const springConfig = {
  tension: 180,
  friction: 22,
  mass: 1
};

const Screen = () => {
  const loaded = useLoaded(1000);
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [
    getUnconfirmedTransactions,
    {
      isLoading: isLoadingTransactions,
      isSuccess: isTransactionsSuccess
    }
  ] = useLazyGetUnconfirmedTransactionsQuery();

  const unconfirmedTransactions = useAppSelector(
    (state) =>
      selectUnconfirmedTransactions(state, {
        month: month || new Date().getMonth(),
        year: year || new Date().getFullYear()
      }),
    shallowEqual
  );

  useEffect(() => {
    if (month && year) {
      getUnconfirmedTransactions({
        confirmed: false,
        start: dayjs(`${year}-${month}-01`).startOf('month').unix(),
        end: dayjs(`${year}-${month}-01`).endOf('month').unix()
      })
    }
  }, [month, year, getUnconfirmedTransactions]);

  const itemsApi = useSpringRef();
  const itemTransitions = useTransition(unconfirmedTransactions, {
    from: (item, index) => ({
      top: _getY(index, expanded, false)
    }),
    enter: (item, index) => ({
      top: _getY(index, expanded, true),
      zIndex: unconfirmedTransactions!.length - index,
      opacity: _getOpacity(index, expanded)
    }),
    update: (item, index) => ({
      top: _getY(index, expanded, true),
      zIndex: unconfirmedTransactions!.length - index,
      opacity: _getOpacity(index, expanded)
    }),
    config: springConfig,
    immediate: !loaded && expanded,
    ref: itemsApi
  });

  useEffect(() => {
    itemsApi.start();
  }, [expanded, isTransactionsSuccess]);

  return (
    <BottomDrawerModal
      onExpand={() => setExpanded(true)}
      onCollapse={() => setExpanded(false)}
      onClose={() => navigation.goBack()}>
      <View style={styles.transactionsContainer}>
        {itemTransitions((style, item) => (
          <AnimatedTransactionContainer style={[styles.transactionItem, style]}>
            <TransactionItem item={item} />
          </AnimatedTransactionContainer>
        ))}
      </View>
    </BottomDrawerModal>
  )
}

export default Screen
