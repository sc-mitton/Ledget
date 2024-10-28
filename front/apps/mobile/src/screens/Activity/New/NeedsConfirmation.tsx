import { useCallback, useEffect, useState, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import { View, TouchableOpacity, StyleSheet, RefreshControl, SafeAreaView } from 'react-native';
import { useTransition, useSpringRef } from '@react-spring/native';
import { useTheme } from '@shopify/restyle';
import dayjs from 'dayjs';

import styles from '../styles/screen';
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
import { useAppearance } from '@features/appearanceSlice';
import {
  BottomDrawerModal,
  Icon,
  Text,
  CustomScrollView,
  Spinner,
  AnimatedView,
  Box
} from '@ledget/native-ui';
import { useLoaded } from '@ledget/helpers';
import {
  _getY,
  _getScale,
  _getOpacity,
  EXPANDED_GAP,
} from './helpers';
import { ModalScreenProps } from '@types';
import { EmptyBox } from '@ledget/media/native';

const springConfig = {
  tension: 180,
  friction: 22,
  mass: 1
};

const NeedsConfirmation = (props: ModalScreenProps<'Activity'> & { expanded?: boolean }) => {
  const itemHeight = useRef(0);
  const dispatch = useAppDispatch();
  const loaded = useLoaded(1000);
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { mode } = useAppearance();
  const theme = useTheme();

  const [itemHeightSet, setItemHeightSet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [focusedItem, setFocusedItem] = useState<string | undefined>(undefined);
  const [expanded, setExpanded] = useState(props.expanded || false);

  const [confirmTransactions] = useConfirmTransactionsMutation();
  const [getUnconfirmedTransactions, {
    isLoading: isLoadingTransactions,
    isSuccess: isTransactionsSuccess,
  }] = useLazyGetUnconfirmedTransactionsQuery();

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

  const itemsApi = useSpringRef();
  const itemTransitions = useTransition(unconfirmedTransactions, {
    from: (item, index) => ({
      top: _getY(index, expanded, false, itemHeight.current),
    }),
    enter: (item, index) => ({
      top: _getY(index, expanded, true, itemHeight.current),
      zIndex: unconfirmedTransactions!.length - index,
      opacity: itemHeightSet ? _getOpacity(index, expanded) : 0
    }),
    update: (item, index) => ({
      top: _getY(index, expanded, true, itemHeight.current),
      zIndex: unconfirmedTransactions!.length - index,
      opacity: itemHeightSet ? _getOpacity(index, expanded) : 0
    }),
    config: springConfig,
    immediate: !loaded && expanded,
    ref: itemsApi
  });

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
    if (Math.abs(dy) > 100 || (!expanded && dy > 0) || (expanded && dy < 0)) return;
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

  /**** Effects *****/

  useEffect(() => {
    if (month && year) {
      getUnconfirmedTransactions({
        confirmed: false,
        start: dayjs(`${year}-${month}-01`).startOf('month').unix(),
        end: dayjs(`${year}-${month}-01`).endOf('month').unix()
      }, refreshing ? false : true);
    }
  }, [month, year, getUnconfirmedTransactions, refreshing]);

  useEffect(() => {
    if (!itemHeightSet) return;
    itemsApi.start();
  }, [loaded, itemHeightSet, expanded, unconfirmedTransactions]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTransactionsSuccess) {
      timeout = setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [isTransactionsSuccess, refreshing]);

  useEffect(() => {
    if (isLoadingTransactions) {
      setRefreshing(false);
    }
  }, [isLoadingTransactions]);

  useEffect(() => {
    if (!expanded) return;
    if (focusedItem) {
      itemsApi.start((index: any, item: any) => ({
        zIndex: item._item.transaction_id === focusedItem ? 200 : 0,
        immediate: true
      }))
    } else {
      itemsApi.start((index: any, item: any) => ({
        zIndex: unconfirmedTransactions.length - index,
        immediate: true
      }))
    }
  }, [focusedItem]);

  return (
    <BottomDrawerModal.Content
      onDrag={onDrag}
      onExpand={() => setExpanded(true)}
      onCollapse={() => setExpanded(false)}
      onClose={onClose}
      height={focusedItem && !expanded ? 250 : undefined}
    >
      {unconfirmedTransactions.length === 0
        ?
        <View style={styles.emptyBoxGraphic}>
          {isLoadingTransactions
            ? <Spinner color='blueText' />
            : isTransactionsSuccess
              ? <EmptyBox dark={mode === 'dark'} />
              : null}
        </View>
        :
        <SafeAreaView>
          <CustomScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                style={{ transform: [{ scaleY: .7 }, { scaleX: .7 }] }}
                colors={[theme.colors.blueText]}
                progressBackgroundColor={theme.colors.modalBox}
                tintColor={theme.colors.secondaryText}
                onRefresh={() => { setRefreshing(true) }}
              />}
            overScrollMode='always'
            scrollEnabled={expanded}
            scrollIndicatorInsets={{ right: -4 }}
            showsVerticalScrollIndicator={expanded && loaded}
            contentContainerStyle={[styles.scrollViewContent]}
            style={[styles.scrollView]}>
            <View style={[
              styles.transactionsContainer,
              {
                height: expanded
                  ? (itemHeight.current + EXPANDED_GAP) * unconfirmedTransactions.length + itemHeight.current
                  : itemHeight.current * 2
              }
            ]}>
              <Box style={[StyleSheet.absoluteFillObject, styles.overlay]} backgroundColor='modalBox' />
              {itemTransitions((style, item, _, index) => (
                <AnimatedView
                  onLayout={(e) => {
                    itemHeight.current = e.nativeEvent.layout.height
                    setItemHeightSet(true)
                  }}
                  style={[styles.transactionItem, { transform: [{ scale: _getScale(index, expanded, true) }] }, style]}>
                  <TransactionItem
                    item={item}
                    setFocused={setFocusedItem}
                    contentStyle={{ opacity: expanded || index == 0 ? 1 : .2 }}
                    {...props}
                  />
                </AnimatedView>
              ))}
              {expanded && itemHeightSet &&
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
        </SafeAreaView>}
    </BottomDrawerModal.Content>
  )
}

export default NeedsConfirmation;
