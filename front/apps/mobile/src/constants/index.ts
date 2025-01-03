export const chartWindows = [
  { key: '3M', label: '3 Months' },
  { key: '6M', label: '6 Months' },
  { key: '1Y', label: '1 Year' },
  { key: 'ALL', label: 'All' },
] as const;

import dayjs from 'dayjs';

export const tempDepositBalanceChartData = [1200, 3000, 3700, 3700, 4500].map(
  (balance, index) => ({
    balance,
    date:
      index > 0
        ? dayjs().subtract(index, 'month').format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
  })
);

export const tempInvestmentsBalanceChartData = [
  5567.19, 5537.02, 5509.01, 5475.09, 5460.48, 5482.87, 5477.9, 5469.3, 5447.87,
  5464.62, 5473.17, 5487.03, 5473.23, 5431.6, 5433.74, 5421.03, 5375.32,
  5360.79, 5346.99, 5352.96, 5354.03, 5291.34, 5283.4, 5277.51, 5235.48,
  5266.95, 5306.04, 5304.72, 5267.84, 5307.01, 5321.41,
];
