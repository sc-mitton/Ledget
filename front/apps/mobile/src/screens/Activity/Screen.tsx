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
import { ModalScreenProps } from '@types';

const AnimatedTransactionContainer = animated(View);

const springConfig = {
  tension: 180,
  friction: 22,
  mass: 1
};

const Screen = (props: ModalScreenProps<'Activity'>) => {
  const loaded = useLoaded(1000);
  const [expanded, setExpanded] = useState(props.route.params?.expanded || false);
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
  }, [expanded, isTransactionsSuccess, unconfirmedTransactions]);

  const onClose = useCallback(() => {
    props.navigation.goBack();
    // Flush the queue

    if (confirmedTransactions.length > 0) {
      // confirmTransactions(
      //   confirmedTransactions.map((item) => ({
      //     transaction_id: item.transaction.transaction_id,
      //     splits: item.categories
      //       ? item.categories.map((cat) => ({
      //         category: cat.id,
      //         fraction: cat.fraction
      //       }))
      //       : undefined,
      //     bill: item.bill
      //   }))
      // );
    }
  }, []);

  const confirmAll = useCallback(() => {
  }, []);

  const onDrag = useCallback((dy: number, expanded: boolean) => {
    if (Math.abs(dy) > 100 || (!expanded && dy > 0)) return;
    else if (dy === 0) {
      itemsApi.start((index: any, item: any) => {
        return { top: _getY(index, expanded, true) };
      });
    } else if (dy < 0) {
      itemsApi.start((index: any, item: any) => {
        return { top: _getY(index, false, true) + Math.pow(Math.abs(dy) * index, .8) };
      });
    } else {
      itemsApi.start((index: any, item: any) => {
        return { top: _getY(index, true, true) - Math.pow(Math.abs(dy) * index, .6) };
      });
    }
  }, [expanded]);

  return (
    <BottomDrawerModal
      showsVerticalScrollIndicator={expanded}
      onDrag={onDrag}
      onExpand={() => setExpanded(true)}
      onCollapse={() => setExpanded(false)}
      scrollEnabled={expanded}
      onClose={onClose}
      renderContent={() => (
        <View style={[
          styles.transactionsContainer,
          { height: expanded ? (HEIGHT + EXPANDED_GAP) * unconfirmedTransactions.length + 32 : HEIGHT * 2 }
        ]}>
          {itemTransitions((style, item, _, index) => (
            <AnimatedTransactionContainer style={[styles.transactionItem, style]}>
              <TransactionItem
                item={item}
                style={{ transform: [{ scale: _getScale(index, expanded, true) }] }}
                contentStyle={{ opacity: expanded || index == 0 ? 1 : .2 }}
              />
            </AnimatedTransactionContainer>
          ))}
          {expanded &&
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
      )}
    />
  )
}

export default Screen
