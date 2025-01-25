import dayjs from 'dayjs';

const today = new Date();
const data = [
  {
    month: new Date(today.getFullYear(), today.getMonth() - 4).getMonth(),
    year: new Date(today.getFullYear(), today.getMonth() - 4).getFullYear(),
    amount_spent: 2000,
  },
  {
    month: new Date(today.getFullYear(), today.getMonth() - 3).getMonth(),
    year: new Date(today.getFullYear(), today.getMonth() - 3).getFullYear(),
    amount_spent: 2400,
  },
  {
    month: new Date(today.getFullYear(), today.getMonth() - 2).getMonth(),
    year: new Date(today.getFullYear(), today.getMonth() - 2).getFullYear(),
    amount_spent: 2200,
  },
  {
    month: new Date(today.getFullYear(), today.getMonth() - 1).getMonth(),
    year: new Date(today.getFullYear(), today.getMonth() - 1).getFullYear(),
    amount_spent: 2600,
  },
];

export const fakeChartData = data.map((d) => ({
  x: dayjs(new Date(d.year, d.month, 1)).format('D-M-YYYY'),
  y: d.amount_spent,
}));

const minY = fakeChartData.reduce((acc, d) => Math.min(d.y, acc), Infinity);
const maxY = fakeChartData.reduce((acc, d) => Math.max(d.y, acc), -Infinity);

export const fakeDataYAxisBoundaries = [
  minY - (maxY - minY) * 0.25,
  maxY + (maxY - minY) * 0.25,
] as [number, number];
