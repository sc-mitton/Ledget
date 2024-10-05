import dayjs from 'dayjs'

export const windows = [
  { key: '3M', label: '3 Months' },
  { key: '6M', label: '6 Months' },
  { key: '1Y', label: '1 Year' },
  { key: 'ALL', label: 'All' }
] as const

export const tempChartData = [
  { date: dayjs().startOf('month').subtract(3, 'month').format('YYYY-MM-DD'), balance: 1200 },
  { date: dayjs().startOf('month').subtract(2, 'month').format('YYYY-MM-DD'), balance: 2700 },
  { date: dayjs().startOf('month').subtract(1, 'month').format('YYYY-MM-DD'), balance: 2000 },
  { date: dayjs().startOf('month').format('YYYY-MM-DD'), balance: 4000 },
  { date: dayjs().format('YYYY-MM-DD'), balance: 5000 },
]
