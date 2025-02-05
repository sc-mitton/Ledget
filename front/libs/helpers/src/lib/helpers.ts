import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Bill } from '@ledget/shared-features';

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
  error: unknown
): error is { error: { message: string } } {
  return (
    typeof error === 'object' &&
    error != null &&
    'error' in error &&
    typeof (error as any).error === 'object' &&
    'message' in (error as any).error &&
    typeof (error as any).error.message === 'string'
  );
}

export function isErrorWithCode(
  error: unknown
): error is { error: { code: string | number } } {
  return (
    typeof error === 'object' &&
    error != null &&
    'error' in error &&
    typeof (error as any).error === 'object' &&
    'code' in (error as any).error &&
    (typeof (error as any).error.code === 'string' ||
      typeof (error as any).error.code === 'number')
  );
}

export function hasErrorCode(
  code: string | number,
  error?: FetchBaseQueryError | SerializedError
): boolean {
  return (
    (error &&
      'status' in error &&
      isErrorWithCode(error.data) &&
      error.data.error.code === code) ||
    false
  );
}

const noCentsFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});
const withCentsFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const formatCurrency = (
  val: number | string | undefined,
  withCents = true
) => {
  if (!val || (typeof val === 'string' && !parseInt(val)))
    return withCents ? '$0.00' : '$0';

  const currencyAmount =
    typeof val === 'string' ? makeIntCurrencyFromStr(val) : val;

  return withCents
    ? withCentsFormatter.format(currencyAmount / 100)
    : noCentsFormatter.format(Math.floor(currencyAmount / 100));
};

// Takes in a string currency and returns an integer
// by removing all non-numeric characters and leading zeros
// ex: $1,000.00 -> 100000, $250 -> 25000
export const makeIntCurrencyFromStr = (s: string) => {
  if (s.replace(/[^0-9]/g, '').replace(/^[0]/g, '') === '0') return 0;
  let newVal;
  newVal = parseInt(s.replace(/[^0-9]/g, '').replace(/^0+/, ''));
  return s.includes('.') ? newVal : newVal * 100;
};

type Reducable = { reduce: (acc: any, curr: any) => any; [index: number]: any };
type Lengthy = { length: number; [index: string | number]: any };

// For list of objects, returns the length of the longest string
// for the given key
export const getLongestLength = (items: Reducable, key: string) => {
  const longestLength = items.reduce((acc: Lengthy, curr: Lengthy) => {
    if (curr[key] && curr[key].toString().length > acc) {
      return curr[key].toString().length + 5;
    } else {
      return acc;
    }
  }, 0);
  return longestLength;
};

export function shuffleArray(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export const formatDateOrRelativeDate = (unixTimestamp: number) => {
  const currentDate = new Date();
  const inputDate = new Date(unixTimestamp); // Convert Unix timestamp to milliseconds

  const timeDiffInDays = Math.floor(
    (currentDate.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (timeDiffInDays === 1) {
    return 'yesterday';
  } else if (timeDiffInDays === 0) {
    return 'today';
  } else if (timeDiffInDays === 2) {
    return '2 days ago';
  } else if (timeDiffInDays === 3) {
    return '3 days ago';
  } else {
    return inputDate.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
    });
  }
};

export const getOrderSuffix = (day: number) => {
  if (day > 10 && day < 20) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const mapWeekDayNumberToName = (day: number) => {
  switch (day) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    default:
      return '';
  }
};

export const stringLimit = (str: string, limit: number) => {
  return str.length > limit ? str.slice(0, limit) + '...' : str;
};

export function camelToSpaceWithCaps(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert a space before each uppercase letter
    .replace(/^./, (match) => match.toUpperCase()); // Capitalize the first letter of the string
}

export function capitalize(str: string) {
  return str
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

export const getNextBillDate = (bill: Bill) => {
  let date = new Date();

  if (bill.year && bill.month && bill.day) {
    return new Date(bill.year, bill.month, bill.day).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
  } else if (bill.month && bill.day) {
    date.setMonth(bill.month);
    date.setDate(bill.day);
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } else if (bill.week_day && bill.week) {
    date.setMonth(date.getMonth() + 1);
    date.setDate(1 + (bill.week! - 1) * 7);
    date.setDate(
      date.getDate() + ((bill.week_day! - 1 - date.getDay() + 7) % 7)
    );
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } else if (bill.day) {
    date.setMonth(date.getMonth() + 1);
    date.setDate(bill.day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};
