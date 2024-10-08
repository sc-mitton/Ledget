import dayjs from 'dayjs';

import { getOrderSuffix } from '@ledget/helpers';
import { Bill } from '@ledget/shared-features';

export const getScheduleDescription = (bill: Bill) => {
  if (bill.day && bill.month && bill.year) {
    return dayjs()
      .date(bill.day)
      .month(bill.month - 1)
      .year(bill.year)
      .format('MMMM Do, YYYY');
  } else if (bill.day && bill.month) {
    return dayjs()
      .date(bill.day)
      .month(bill.month - 1)
      .format('MMMM Do');
  } else if (bill.day) {
    return `${bill.day}${getOrderSuffix(bill.day)} of the month`;
  } else if (bill.week && bill.week_day) {
    return `Every ${bill.week}${getOrderSuffix(bill.week)} ${dayjs()
      .day(bill.week_day)
      .format('dddd')}`;
  }
};
