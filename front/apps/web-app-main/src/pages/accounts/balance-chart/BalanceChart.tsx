import { useEffect, useState } from 'react';

import { ResponsiveLine } from '@nivo/line';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import Big from 'big.js';

import styles from './balance-chart.module.scss';
import { useLazyGetAccountBalanceHistoryQuery } from '@ledget/shared-features';
import {
  ResponsiveLineContainer,
  useMinimalistNivoResponsiveBaseProps,
  useMinimalistNivoResponsiveLineTheme,
  DollarCents,
  ChartTip,
  BlueFadedSquareRadio,
} from '@ledget/ui';
import { useAccountsContext } from '../context';
import pathMappings from '../path-mappings';

// const fakeData = [
//     { x: '2024-01-01', y: 1200 },
//     { x: '2024-02-01', y: 1500 },
//     { x: '2024-03-01', y: 2120 },
//     { x: '2024-04-01', y: 2000 },
//     { x: '2024-05-01', y: 2700 },
//     { x: '2024-06-01', y: 3000 },
// ]

export const BalanceChart = () => {
  const { accounts } = useAccountsContext();
  const location = useLocation();
  const [getAccountBalance, { data: balanceHistoryData }] =
    useLazyGetAccountBalanceHistoryQuery();
  const nivoBaseProps = useMinimalistNivoResponsiveBaseProps({
    primaryColor: '--blue-medium',
    gradientColorStart: '--blue-light-medium',
    gradientColorEnd: '--window2',
    borderColor: '--window2',
  });
  const nivoTheme = useMinimalistNivoResponsiveLineTheme({
    primaryColor: '--blue-medium',
  });
  const [yBoundaries, setYBoundaries] = useState<[number, number]>([0, 0]);
  const [window, setWindow] = useState<'6M' | '1Y' | 'MAX'>('6M');

  useEffect(() => {
    const start =
      window === '6M'
        ? dayjs().subtract(6, 'months').startOf('month').unix()
        : window === '1Y'
        ? dayjs().subtract(1, 'year').startOf('month').unix()
        : dayjs().subtract(5, 'years').startOf('month').unix();

    if (accounts?.length) {
      getAccountBalance({
        start,
        end: dayjs().endOf('month').unix(),
        type: pathMappings.getAccountType(location) as
          | 'depository'
          | 'investment',
        accounts: accounts.map((account) => account.id),
      });
    }
  }, [location.pathname, window]);

  // Set the y boundaries every time
  useEffect(() => {
    if (balanceHistoryData) {
      let min: number = Infinity;
      let max: number = -Infinity;
      for (const account of balanceHistoryData) {
        for (const item of account.history) {
          min = Math.min(min, item.balance);
          max = Math.max(max, item.balance);
        }
      }
      // for (const item of fakeData) {
      //     min = Math.min(min, item.y)
      //     max = Math.max(max, item.y)
      // }
      setYBoundaries([min * 0.875, max * 1.5]);
    }
  }, [accounts, balanceHistoryData]);

  return (
    <div className={styles.history}>
      <div className={styles.chart}>
        <div>
          <ResponsiveLineContainer>
            {accounts && (
              <ResponsiveLine
                data={[
                  {
                    id: 'balance',
                    data: Object.entries(
                      balanceHistoryData?.reduce((acc, account) => {
                        for (const item of account.history) {
                          if (!acc[item.month]) {
                            acc[item.month] = 0;
                          }
                          acc[item.month] += item.balance;
                        }
                        return acc;
                      }, {} as Record<string, number>) || {}
                    ).map(([month, balance]) => ({
                      x: month,
                      y: balance,
                    })),
                    // data: fakeData
                  },
                ]}
                tooltip={({ point }) => {
                  return (
                    <ChartTip
                      position={
                        point.index <= accounts.length / 2 ? 'left' : 'right'
                      }
                    >
                      <span style={{ opacity: 0.5 }}>{`${dayjs(
                        point.data.x
                      ).format('MMM D')}`}</span>
                      &nbsp;&nbsp;
                      <DollarCents
                        value={Big(point.data.y as number)
                          .times(100)
                          .toNumber()}
                      />
                    </ChartTip>
                  );
                }}
                yScale={{
                  type: 'linear',
                  min: yBoundaries[0] - (yBoundaries[1] - yBoundaries[0]) * 0.5,
                  max: yBoundaries[1] + (yBoundaries[1] - yBoundaries[0]) * 0.5,
                }}
                xScale={{
                  type: 'time',
                  format: '%Y-%m-%d',
                  precision: 'minute',
                  useUTC: false,
                }}
                margin={{ top: 8, right: 12, bottom: 32, left: 10 }}
                {...nivoBaseProps}
                theme={nivoTheme}
                axisBottom={{
                  format: (value) =>
                    dayjs(value).format(window === '6M' ? 'MMM' : 'MMM YY'),
                  tickValues:
                    window === '6M'
                      ? 'every 1 month'
                      : window === '1Y'
                      ? 'every 2 months'
                      : 'every 4 months',
                }}
              />
            )}
          </ResponsiveLineContainer>
        </div>
      </div>
      <div className={styles.buttons}>
        <BlueFadedSquareRadio
          onClick={() => setWindow('6M')}
          selected={window === '6M'}
        >
          6M
        </BlueFadedSquareRadio>
        <BlueFadedSquareRadio
          onClick={() => setWindow('1Y')}
          selected={window === '1Y'}
        >
          1Y
        </BlueFadedSquareRadio>
        <BlueFadedSquareRadio
          onClick={() => setWindow('MAX')}
          selected={window === 'MAX'}
        >
          MAX
        </BlueFadedSquareRadio>
      </div>
    </div>
  );
};
