import { useEffect, useState } from 'react';

import { ResponsiveLine } from '@nivo/line';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import Big from 'big.js';

import styles from './styles/chart.module.scss';
import {
  useGetAccountsQuery,
  useLazyGetAccountBalanceHistoryQuery,
} from '@ledget/shared-features';
import {
  ResponsiveLineContainer,
  useMinimalistNivoResponsiveBaseProps,
  useMinimalistNivoResponsiveLineTheme,
  ChartTip,
  BlueFadedSquareRadio,
  BakedListBox,
} from '@ledget/ui';
import pathMappings from '../path-mappings';
import { tempDepositBalanceChartData } from '../constants/temp-chart-data';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const windowOptions = ['3M', '6M', '1Y', 'MAX'] as const;

export const Chart = () => {
  const location = useLocation();
  const nivoBaseProps = useMinimalistNivoResponsiveBaseProps({
    primaryColor: '--blue-light-medium',
    gradientColorStart: '--blue-light-hover',
    gradientColorEnd: '--window',
    borderColor: '--window2',
  });
  const nivoTheme = useMinimalistNivoResponsiveLineTheme({
    primaryColor: '--blue-light-medium',
  });

  const { data: accountsData } = useGetAccountsQuery();
  const [getBalanceHistory, { data: balanceHistory }] =
    useLazyGetAccountBalanceHistoryQuery();

  const [yTopBoundary, setYTopBoundary] = useState(0);
  const [chartData, setChartData] = useState(tempDepositBalanceChartData);
  const [dateWindow, setDateWindow] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  const [window, setWindow] = useState<(typeof windowOptions)[number]>(
    windowOptions[0]
  );

  useEffect(() => {
    switch (window) {
      case '3M':
        setDateWindow({
          start: dayjs()
            .startOf('day')
            .subtract(3, 'month')
            .startOf('month')
            .unix(),
          end: dayjs().startOf('day').unix(),
        });
        break;
      case '6M':
        setDateWindow({
          start: dayjs()
            .startOf('day')
            .subtract(6, 'month')
            .startOf('month')
            .unix(),
          end: dayjs().startOf('day').unix(),
        });
        break;
      case '1Y':
        setDateWindow({
          start: dayjs()
            .startOf('day')
            .subtract(1, 'year')
            .startOf('month')
            .unix(),
          end: dayjs().startOf('day').unix(),
        });
        break;
      case 'MAX':
        setDateWindow({
          start: dayjs().startOf('day').subtract(10, 'year').unix(),
          end: dayjs().startOf('day').unix(),
        });
        break;
    }
  }, [window]);

  useEffect(() => {
    if (accountsData?.accounts.length) {
      getBalanceHistory(
        {
          start: dateWindow.start,
          end: dateWindow.end,
          type: pathMappings.getAccountType(location) as
            | 'depository'
            | 'investment',
          accounts: ['*'],
        },
        true
      );
    }
  }, [location.pathname, window, accountsData]);

  // Set the y boundaries every time
  useEffect(() => {
    if (chartData) {
      setYTopBoundary(
        1.5 * chartData.reduce((acc, pt) => Math.max(pt.y, acc), -Infinity)
      );
    }
  }, [chartData]);

  useEffect(() => {
    if (balanceHistory) {
      const chartData = balanceHistory
        .reduce(
          (acc, balance) => {
            return acc.map((h, i) => ({
              x: h.x,
              y: Big(h.y || 0)
                .plus(balance.history[i]?.balance || 0)
                .toNumber(),
            }));
          },
          balanceHistory[0].history.map((h) => ({ x: h.month, y: 0 }))
        )
        .reverse();
      if (chartData.length < 2) return;
      setChartData(chartData);
    }
  }, [balanceHistory]);

  return (
    <div className={styles.history}>
      <div className={styles.chart}>
        <ResponsiveLineContainer>
          <ResponsiveLine
            data={[{ id: 'balance', data: chartData }]}
            tooltip={({ point }) => {
              return (
                <ChartTip position={'center'}>
                  <span>{`${dayjs(point.data.x).format('M/D/YY')}`}</span>
                  &nbsp;&nbsp;
                  {formatter.format(point.data.y as number)}
                </ChartTip>
              );
            }}
            xScale={{
              type: 'time',
              format: '%Y-%m-%d',
              precision: 'minute',
              useUTC: false,
            }}
            yScale={{
              type: 'linear',
              max: yTopBoundary,
            }}
            margin={{ top: 8, right: 16, bottom: 36, left: 12 }}
            {...nivoBaseProps}
            theme={nivoTheme}
            axisBottom={{
              format: (value) =>
                dayjs(value).format(
                  ['3M', '6M'].includes(window || '') ? 'MMM' : 'MMM YY'
                ),
              tickValues: ['3M', '6M'].includes(window || '')
                ? 'every 1 month'
                : window === '1Y'
                ? 'every 2 months'
                : 'every 4 months',
            }}
          />
        </ResponsiveLineContainer>
      </div>
      <div className={styles.windowSelect}>
        <BakedListBox
          placement="right"
          as={BlueFadedSquareRadio}
          options={windowOptions}
          defaultValue={'3M'}
          multiple={false}
          withChevron={false}
          allowNoneSelected={true}
          onChange={setWindow}
        />
      </div>
    </div>
  );
};

export default Chart;
