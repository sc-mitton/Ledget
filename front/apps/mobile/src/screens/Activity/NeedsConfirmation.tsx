import { useCallback, useEffect, useState, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import { animated, useTransition, useSpringRef } from '@react-spring/native';
import dayjs from 'dayjs';

import styles from './styles/screen';
import TransactionItem from './TransactionItem';
import { useAppDispatch, useAppSelector } from '@hooks';
import { CheckAll } from '@ledget/media/native';
import {
  selectUnconfirmedTransactions,
  selectBudgetMonthYear,
  useLazyGetUnconfirmedTransactionsQuery,
  selectConfirmedTransactions,
  useConfirmTransactionsMutation,
  // These are for flushing the queue
  ConfirmedQueue,
  QueueItemWithCategory,
  QueueItemWithBill,
  removeUnconfirmedTransaction,
  addTransaction2Cat,
  addTransaction2Bill
} from "@ledget/shared-features";
import { BottomDrawerModal, Icon, Text, CustomScrollView } from '@ledget/native-ui';
import { useLoaded } from '@ledget/helpers';
import {
  _getY,
  _getScale,
  _getOpacity,
  EXPANDED_GAP,
} from './helpers';
import { ModalScreenProps } from '@types';

const AnimatedTransactionContainer = animated(View);

const springConfig = {
  tension: 180,
  friction: 22,
  mass: 1
};

const NeedsConfirmation = (props: ModalScreenProps<'Activity'>) => {
  const itemHeight = useRef(0);
  const dispatch = useAppDispatch();
  const loaded = useLoaded(1000);
  const [focusedItem, setFocusedItem] = useState<string | undefined>(undefined);
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
      top: _getY(index, expanded, false, itemHeight.current)
    }),
    enter: (item, index) => ({
      top: _getY(index, expanded, true, itemHeight.current),
      zIndex: unconfirmedTransactions!.length - index,
      opacity: _getOpacity(index, expanded)
    }),
    update: (item, index) => ({
      top: _getY(index, expanded, true, itemHeight.current),
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

  useEffect(() => {
    if (!expanded) return;
    if (focusedItem) {
      itemsApi.start((index: any, item: any) => ({
        opacity: item._item.transaction_id === focusedItem ? 1 : .4
      }))
    } else {
      itemsApi.start((index: any, item: any) => ({ opacity: 1 }))
    }
  }, [focusedItem]);

  const onClose = useCallback(() => {
    props.navigation.goBack();
    // Flush the queue

    if (confirmedTransactions.length > 0) {
      confirmTransactions(
        confirmedTransactions.map((item) => ({
          transaction_id: item.transaction.transaction_id,
          splits: item.categories
            ? item.categories.map((cat) => ({
              category: cat.id,
              fraction: cat.fraction
            }))
            : undefined,
          bill: item.bill
        }))
      );
    }
  }, []);

  const confirmAll = useCallback(() => {
    itemsApi.start((index: any, item: any) => ({
      x: 100,
      opacity: 0,
      delay: index * 50,
      config: { duration: 130 }
    }));

    // Dispatch confirm for all items
    setTimeout(() => {
      const confirmed: ConfirmedQueue = [];
      for (let transaction of unconfirmedTransactions) {

        const ready2ConfirmItem: (QueueItemWithCategory | QueueItemWithBill) = {
          transaction: transaction,
          bill: transaction.predicted_bill?.id
        };

        // Update meta data for immediate ui updates
        if (ready2ConfirmItem.bill) {
          dispatch(
            addTransaction2Bill({
              billId: ready2ConfirmItem.bill,
              amount: ready2ConfirmItem.transaction.amount
            })
          );
        } else if (ready2ConfirmItem.categories) {
          for (let category of ready2ConfirmItem.categories) {
            dispatch(
              addTransaction2Cat({
                categoryId: category.id,
                amount: ready2ConfirmItem.transaction.amount,
                period: category.period
              })
            );
          }
        }
        dispatch(removeUnconfirmedTransaction(transaction.transaction_id));
        confirmed.push(ready2ConfirmItem);
      }
      confirmTransactions(
        confirmed.map((item) => ({
          transaction_id: item.transaction.transaction_id,
          splits: item.categories
            ? item.categories.map((cat) => ({
              category: cat.id,
              fraction: cat.fraction
            }))
            : undefined,
          bill: item.bill
        }))
      );
    }, 130 + unconfirmedTransactions.length * 50);
  }, []);

  const onDrag = useCallback((dy: number, expanded: boolean) => {
    if (Math.abs(dy) > 100 || (!expanded && dy > 0)) return;
    else if (dy === 0) {
      itemsApi.start((index: any, item: any) => {
        return { top: _getY(index, expanded, true, itemHeight.current) };
      });
    } else if (dy < 0) {
      itemsApi.start((index: any, item: any) => {
        return { top: _getY(index, false, true, itemHeight.current) + Math.pow(Math.abs(dy) * index, .8) };
      });
    } else {
      itemsApi.start((index: any, item: any) => {
        return { top: _getY(index, true, true, itemHeight.current) - Math.pow(Math.abs(dy) * index, .6) };
      });
    }
  }, [expanded]);

  return (
    <BottomDrawerModal.Content
      onDrag={onDrag}
      onExpand={() => setExpanded(true)}
      onCollapse={() => setExpanded(false)}
      onClose={onClose}
    >
      <CustomScrollView
        scrollEnabled={expanded}
        scrollIndicatorInsets={{ right: -4 }}
        showsVerticalScrollIndicator={expanded}
        style={[styles.scrollView]}>
        <View style={[
          styles.transactionsContainer,
          {
            height: expanded
              ? (itemHeight.current + EXPANDED_GAP) * unconfirmedTransactions.length + 32
              : itemHeight.current * 2
          }
        ]}>
          {itemTransitions((style, item, _, index) => (
            <AnimatedTransactionContainer
              onLayout={(e) => itemHeight.current = e.nativeEvent.layout.height}
              style={[styles.transactionItem, style]}>
              <TransactionItem
                item={item}
                setFocused={setFocusedItem}
                style={{ transform: [{ scale: _getScale(index, expanded, true) }] }}
                contentStyle={{ opacity: expanded || index == 0 ? 1 : .2 }}
                {...props}
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
      </CustomScrollView>
    </BottomDrawerModal.Content>
  )
}

export default NeedsConfirmation
