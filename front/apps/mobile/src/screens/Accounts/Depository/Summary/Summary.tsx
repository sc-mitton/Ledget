import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native'
import { CartesianChart, Area, Line, useChartPressState } from 'victory-native';
import {
  Text as SkText,
  LinearGradient,
  useFont,
  vec,
  Circle
} from '@shopify/react-native-skia';
import { ArrowDownRight, ArrowUpRight } from 'geist-native-icons';
import { useTheme } from '@shopify/restyle';
import Big from 'big.js';
import dayjs from 'dayjs';
import { useDerivedValue } from 'react-native-reanimated';

import styles from './styles/summary';
import { AccountsTabsScreenProps } from '@types';
import { Box, DollarCents, Icon, Text, Menu, Button } from '@ledget/native-ui';
import { useGetAccountsQuery, useLazyGetAccountBalanceHistoryQuery, useLazyGetAccountBalanceTrendQuery } from '@ledget/shared-features';

import SourceSans3Regular from '../../../../../assets/fonts/SourceSans3Regular.ttf';
import { useAppearance } from '@/features/appearanceSlice';

const windows = [
  { key: '3M', label: '3 Months' },
  { key: '6M', label: '6 Months' },
  { key: '1Y', label: '1 Year' },
  { key: 'ALL', label: 'All' }
]

export default function Summary(props: AccountsTabsScreenProps<'Depository'>) {
  const { data: accountsData } = useGetAccountsQuery()
  const [getBalanceTrend, { data: balanceTrend }] = useLazyGetAccountBalanceTrendQuery()
  const [getBalanceHistory, { data: balanceHistory }] = useLazyGetAccountBalanceHistoryQuery()
  const { mode } = useAppearance();
  const theme = useTheme();
  const font = useFont(SourceSans3Regular, 14)

  const [window, setWindow] = useState<typeof windows[number]['key']>(windows[0].key)
  const [dateWindow, setDateWindow] = useState<{ start: number, end: number }>({ start: 0, end: 0 })
  const [calculatedTrend, setCalculatedTrend] = useState(0)
  const [balanceHistoryChartData, setBalanceHistoryChartData] = useState<{ date: string, balance: number }[]>([])
  const { state, isActive } = useChartPressState({ x: '0', y: { balance: 0 } })

  const totalBalance = useMemo(
    () =>
      accountsData?.accounts
        .filter((a) => a.type === props.route.name.toLowerCase())
        .reduce((acc, account) => acc.plus(account.balances.current), Big(0))
        .times(100)
        .toNumber() || 0,
    [accountsData]
  )

  const value = useDerivedValue(() => {
    return "$" + `${state.y.balance.value.value}`.split('.')[0];
  }, [state]);

  const textYPosition = useDerivedValue(() => {
    return state.y.balance.position.value - 15;
  }, [value]);

  const textXPosition = useDerivedValue(() => {
    const lastValue = balanceHistoryChartData[balanceHistoryChartData.length - 1]?.balance || 0;
    const firstValue = balanceHistoryChartData[0]?.balance || 0;
    if (!font) {
      return 0;
    } else if (value.value === `$${Math.floor(lastValue)}`) {
      return state.x.position.value - font.measureText(value.value).width - 4
    } else if (value.value === `$${Math.floor(firstValue)}`) {
      return state.x.position.value + 4;
    }

    return (
      state.x.position.value - font.measureText(value.value).width / 2
    );
  }, [value, font, balanceHistoryChartData]);

  useEffect(() => {
    if (balanceHistory) {
      const chartData = balanceHistory.reduce((acc, balance) => {
        return acc.map((h, i) => ({
          date: h.date,
          balance: Big(h.balance || 0).plus(balance.history[i]?.balance || 0).toNumber()
        }))
      }, balanceHistory[0].history.map(h => ({ date: h.month, balance: 0 }))).reverse();
      setBalanceHistoryChartData(chartData);
    }
  }, [balanceHistory])

  useEffect(() => {
    if (balanceTrend && (accountsData?.accounts.length || 0 > 0)) {
      setCalculatedTrend(
        balanceTrend.trends
          .filter((t) => accountsData?.accounts.some((a) => a.account_id === t.account))
          .reduce((acc, trend) => acc.plus(trend.trend), Big(0))
          .times(100)
          .toNumber() || 0
      )
    }
  }, [balanceTrend, accountsData])

  useEffect(() => {
    if (dateWindow.start && dateWindow.end && accountsData) {
      getBalanceHistory({
        start: dateWindow.start,
        end: dateWindow.end,
        type: props.route.name.toLowerCase() as any,
        accounts: accountsData?.accounts.map(a => a.account_id) || [],
      });
    }
  }, [accountsData, dateWindow]);

  useEffect(() => {
    if (accountsData?.accounts.length) {
      getBalanceTrend({
        type: props.route.name.toLowerCase() as any,
        accounts: accountsData.accounts.map(a => a.account_id),
      })
    }
  }, [accountsData])

  useEffect(() => {
    switch (window) {
      case '3M':
        setDateWindow({
          start: dayjs().subtract(3, 'month').unix(),
          end: dayjs().unix()
        });
        break;
      case '6M':
        setDateWindow({
          start: dayjs().subtract(6, 'month').unix(),
          end: dayjs().unix()
        });
        break;
      case '1Y':
        setDateWindow({
          start: dayjs().subtract(1, 'year').unix(),
          end: dayjs().unix()
        });
        break;
      case 'ALL':
        setDateWindow({
          start: dayjs().subtract(10, 'year').unix(),
          end: dayjs().unix()
        });
        break;
    }
  }, [window]);

  return (
    <Box variant='blueNestedContainer' style={styles.container}>
      <View style={styles.windowMenu}>
        <Menu
          as='menu'
          items={windows.map(w => ({
            label: w.label,
            onSelect: () => setWindow(w.key)
          }))}
          placement='right'
          closeOnSelect={true}
        >
          <Box backgroundColor='lightBlueButton' style={styles.menuButton}>
            <Text color='blueText'>{window}</Text>
          </Box>
        </Menu>
      </View>
      <View>
        <View style={styles.headerTitle}>
          <Text color='tertiaryText'>Total Balance</Text>
          <View style={styles.trendContainer}>
            <DollarCents color='tertiaryText' value={calculatedTrend} withCents={false} />
            <View style={styles.trendIcon}>
              <Icon
                color={calculatedTrend < 0 ? 'alert' : 'greenText'}
                icon={calculatedTrend < 0 ? ArrowDownRight : ArrowUpRight} />
            </View>
          </View>
        </View>
        <DollarCents value={totalBalance} fontSize={26} />
      </View>
      <View style={styles.graphContainer}>
        <CartesianChart
          chartPressState={state}
          data={balanceHistoryChartData}
          xKey={'date'}
          yKeys={['balance']}
          xAxis={{
            font,
            lineWidth: 0,
            tickCount: window.endsWith('M') ? 3 : 5,
            labelColor: theme.colors.faintBlueText,
            formatXLabel: (date) => window.endsWith('M')
              ? `     ${dayjs(date).format('MMM')}`
              : `        ${dayjs(date).format('MMM YY')}`,
          }}
          yAxis={[{
            font,
            lineWidth: 0,
            formatYLabel: () => '',
          }]}
          padding={{
            bottom: 8
          }}
          domainPadding={{
            left: 3,
            right: 3,
          }}
          domain={{
            y: [
              balanceHistoryChartData.reduce((acc, h) => Math.min(acc, h.balance), 0) * 1.5 -
              (balanceHistoryChartData.reduce((acc, h) => Math.max(acc, h.balance), 0) * 1.5
                - balanceHistoryChartData.reduce((acc, h) => Math.min(acc, h.balance), 0) * 1.5) * .2,
              balanceHistoryChartData.reduce((acc, h) => Math.max(acc, h.balance), 0) * 1.5
            ]
          }}
        >
          {({ points, chartBounds }) => (
            <>
              <Line
                points={points.balance}
                color={theme.colors.blueButton}
                strokeWidth={3}
                curveType='natural'
              />
              <Area
                y0={chartBounds.bottom}
                points={points.balance}
                animate={{ type: 'spring', duration: 300 }}
                curveType='natural'
              >
                <LinearGradient
                  colors={[theme.colors.lightBlueButton, theme.colors.blueNestedContainer]}
                  start={vec(chartBounds.bottom, 0)}
                  end={vec(chartBounds.bottom, chartBounds.bottom)}
                />
              </Area>
              {isActive && (
                mode === 'dark'
                  ? <SkText
                    x={textXPosition}
                    y={textYPosition}
                    font={font}
                    color={'#fff'}
                    text={value}
                  />
                  : <SkText
                    x={textXPosition}
                    y={textYPosition}
                    font={font}
                    color={'#000'}
                    text={value}
                  />
              )}
              {isActive && (
                mode === 'dark'
                  ? <Circle
                    cx={state.x.position}
                    cy={state.y.balance.position}
                    r={3}
                    color={'#fff'}
                  />
                  : <Circle
                    cx={state.x.position}
                    cy={state.y.balance.position}
                    r={3}
                    color={'#000'}
                  />
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </Box>
  )
}
