import { useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { animated } from '@react-spring/native';
import { View } from 'react-native';
import dayjs from 'dayjs';

import { Modal } from '@ledget/native-ui';
import StackItem from './StackItem'
import { useAppSelector } from '@hooks'
import {
  selectUnconfirmedTransactions,
  selectBudgetMonthYear,
  useLazyGetUnconfirmedTransactionsQuery
} from "@ledget/shared-features";

const Screen = () => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const [getUnconfirmedTransactions] = useLazyGetUnconfirmedTransactionsQuery();
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

  return (
    <Modal>
      {unconfirmedTransactions.map(t => (
        <StackItem item={t} />
      ))}
    </Modal>
  )
}

export default Screen
