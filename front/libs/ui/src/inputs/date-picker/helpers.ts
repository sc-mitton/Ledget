import { Dayjs } from 'dayjs';
import type { DatePickerProps, TPicker } from './types';

export const checkDisabled = (
  point: Dayjs,
  period: DatePickerProps<TPicker>['period'],
  disabled?: DatePickerProps<TPicker>['disabled']
) => {
  // disabled arg isn't passed when not range picker type
  if (!disabled) return false;

  return disabled.some((window) => {
    if (window?.[0] && window?.[1]) {
      return (
        (point.isAfter(window[0], period) && point.isBefore(window[1]),
        period) ||
        point.isSame(window[0], period) ||
        point.isSame(window[1], period)
      );
    } else if (window?.[1] === undefined) {
      return (
        point.isSame(window[0], period) || point.isAfter(window[0], period)
      );
    } else if (window?.[0] === undefined) {
      return (
        point.isSame(window[1], period) || point.isBefore(window[1], period)
      );
    }
  });
};
