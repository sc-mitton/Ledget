import dayjs from 'dayjs';

export const tempDepositBalanceChartData = [4500, 3700, 3700, 2800, 3000].map(
  (balance, index) => {
    return {
      y: balance,
      x: dayjs()
        .startOf('month')
        .subtract(index - 1, 'month')
        .format('YYYY-MM-DD'),
    };
  }
);
