import { useCallback, useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import { animated, useTransition, useSpringRef } from '@react-spring/native';
import dayjs from 'dayjs';

import styles from './styles/screen';
import TransactionItem from './TransactionItem';
import { useAppSelector } from '@hooks';
import { CheckAll } from '@ledget/media/native';
import {
  selectUnconfirmedTransactions,
  selectBudgetMonthYear,
  useLazyGetUnconfirmedTransactionsQuery,
  selectConfirmedTransactions,
  useConfirmTransactionsMutation
  // These are for flushing the queue
  // ConfirmedQueue,
  // QueueItemWithCategory,
  // QueueItemWithBill,
  // removeUnconfirmedTransaction,
  // addTransaction2Cat,
  // addTransaction2Bill,
  // isCategory,
} from "@ledget/shared-features";
import { BottomDrawerModal, Icon, Text } from '@ledget/native-ui';
import { useLoaded } from '@ledget/helpers';
import {
  _getY,
  _getScale,
  _getOpacity,
  HEIGHT,
  EXPANDED_GAP,
} from './helpers';

const AnimatedTransactionContainer = animated(View);

interface Props {
  expanded: boolean;
}

const springConfig = {
  tension: 180,
  friction: 22,
  mass: 1
};

const NeedsConfirmation = (props: Props) => {
  const loaded = useLoaded(1000);
  const itemsApi = useSpringRef();
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [
    getUnconfirmedTransactions,
    {
      isLoading: isLoadingTransactions,
      isSuccess: isTransactionsSuccess
    }
  ] = useLazyGetUnconfirmedTransactionsQuery();
  const [confirmTransactions] = useConfirmTransactionsMutation();

  const unconfirmedTransactions = useAppSelector(
    (state) =>
      selectUnconfirmedTransactions(state, {
        month: month || new Date().getMonth(),
        year: year || new Date().getFullYear()
      }),
    shallowEqual
  );
  const confirmedTransactions = useAppSelector(
    (state) =>
      selectConfirmedTransactions(state, {
        month: month || new Date().getMonth(),
        year: year || new Date().getFullYear()
      }),
    shallowEqual
  );

  const itemTransitions = useTransition(unconfirmedTransactions, {
    from: (item, index) => ({
      top: _getY(index, props.expanded, false)
    }),
    enter: (item, index) => ({
      top: _getY(index, props.expanded, true),
      zIndex: unconfirmedTransactions!.length - index,
      opacity: _getOpacity(index, props.expanded)
    }),
    update: (item, index) => ({
      top: _getY(index, props.expanded, true),
      zIndex: unconfirmedTransactions!.length - index,
      opacity: _getOpacity(index, props.expanded)
    }),
    config: springConfig,
    immediate: !loaded && props.expanded,
    ref: itemsApi
  });

  const confirmAll = useCallback(() => {
  }, []);

  useEffect(() => {
    if (month && year) {
      getUnconfirmedTransactions({
        confirmed: false,
        start: dayjs(`${year}-${month}-01`).startOf('month').unix(),
        end: dayjs(`${year}-${month}-01`).endOf('month').unix()
      })
    }
  }, [month, year, getUnconfirmedTransactions]);

  useEffect(() => {
    itemsApi.start();
  }, [props.expanded, isTransactionsSuccess, unconfirmedTransactions]);

  return (
    <View style={[
      styles.transactionsContainer,
      { height: props.expanded ? (HEIGHT + EXPANDED_GAP) * unconfirmedTransactions.length + 32 : HEIGHT * 2 }
    ]}>
      {itemTransitions((style, item, _, index) => (
        <AnimatedTransactionContainer style={[styles.transactionItem, style]}>
          <TransactionItem
            item={item}
            style={{ transform: [{ scale: _getScale(index, props.expanded, true) }] }}
          />
        </AnimatedTransactionContainer>
      ))}
      {props.expanded &&
        <View style={styles.checkAllButtonContainer}>
          <TouchableOpacity
            style={styles.checkAllButton}
            activeOpacity={0.7}
            onPress={confirmAll}>
            <Text color='tertiaryText'>Confirm All</Text>
            <Icon color='tertiaryText' icon={CheckAll} size={24} />
          </TouchableOpacity>
        </View>}
    </View>
  )
}

export default NeedsConfirmation
