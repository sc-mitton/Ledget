import dayjs from 'dayjs';

const data = [2400, 2300, 2300, 2200];

export const fakeChartData = data.map((d, i) => ({
  x: dayjs().subtract(i, 'month').startOf('month').format('YYYY-M-D'),
  y: d,
}));

const minY = data.reduce((acc, d) => Math.min(d, acc), Infinity);
const maxY = data.reduce((acc, d) => Math.max(d, acc), -Infinity);

export const fakeDataYAxisBoundaries = [
  minY - (maxY - minY) * 0.25,
  maxY + (maxY - minY) * 0.75,
] as [number, number];
