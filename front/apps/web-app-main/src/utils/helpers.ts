import dayjs from 'dayjs';

import { getOrderSuffix } from '@ledget/helpers';
import { Bill } from '@ledget/shared-features';

export const getScheduleDescription = (value?: Bill) => {
  if (!value) return '';
  if (value.day && value.month) {
    return `${dayjs()
      .month(value.month - 1)
      .day(value.day)
      .format('MMM D')}  every year`;
  } else if (value.day) {
    return `${value.day}${getOrderSuffix(value.day)} of the month`;
  } else if (value.week && value.week_day) {
    return `Every ${value.week}${getOrderSuffix(value.week)} ${dayjs()
      .day(value.week_day)
      .format('dddd')}`;
  }
};
