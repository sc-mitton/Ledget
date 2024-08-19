import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { animated, useTransition, useSpringRef } from '@react-spring/native';
import dayjs from 'dayjs';

import styles from './styles/screen';
import TransactionItem from './TransactionItem'
import { useAppSelector } from '@hooks'
import {
  selectUnconfirmedTransactions,
  selectBudgetMonthYear,
  useLazyGetUnconfirmedTransactionsQuery
} from "@ledget/shared-features";
import { BottomDrawerModal, Button } from '@ledget/native-ui'
import { useAppearance } from '@features/appearanceSlice';
import { useLoaded } from '@ledget/helpers';
import {
  _getY,
  _getScale,
  _getOpacity,
  _getBackGroundColor
} from './helpers';

const AnimatedTransaction = animated(View);

const ITEM_HEIGHT = 72;

const Screen = () => {
  const loaded = useLoaded(1000);
  const { mode } = useAppearance();
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [
    getUnconfirmedTransactions,
    { isLoading: isLoadingTransactions }
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
      // top: getTop(index, false),
      y: _getY(index, expanded, false),
      transform: `scale(${_getScale(index, expanded, false)})`,
      backgroundColor: _getBackGroundColor(
        index,
        expanded,
        mode === 'dark'
      )
    }),
    enter: (item, index) => ({
      y: _getY(index, expanded, true),
      transform: `scale(${_getScale(index, expanded)})`,
      zIndex: `${unconfirmedTransactions!.length - index}`,
      opacity: _getOpacity(index, expanded),
      x: 0,
      left: 0,
      right: 0
    }),
    update: (item, index) => ({
      y: _getY(index, expanded),
      transform: `scale(${_getScale(index, expanded)})`,
      zIndex: `${unconfirmedTransactions!.length - index}`,
      opacity: _getOpacity(index, expanded),
      backgroundColor: _getBackGroundColor(
        index,
        expanded,
        mode === 'dark'
      )
    }),
    onRest: () => {
      // expanded
      //   ? containerApi.start({ overflowY: 'scroll', overflowX: 'hidden' })
      //   : containerApi.start({ overflowY: 'hidden', overflowX: 'hidden' });
    },
    config: {
      tension: 180,
      friction: loaded ? 22 : 40,
      mass: 1
    },
    immediate: !loaded && expanded,
    ref: itemsApi
  });

  return (
    <BottomDrawerModal onClose={() => navigation.goBack()}>
      <View style={styles.transactionsContainer}>
        <Button
          label={expanded ? 'Close' : 'Open'}
          onPress={() => setExpanded(!expanded)}
        />
      </View>
    </BottomDrawerModal>
  )
}

export default Screen
