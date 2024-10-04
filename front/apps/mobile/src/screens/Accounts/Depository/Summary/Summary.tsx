import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { CartesianChart, Area, Line, useChartPressState } from 'victory-native';
import {
  Text as SkText,
  LinearGradient,
  useFont,
  vec,
  Circle
} from '@shopify/react-native-skia';
import { ArrowDownRight, ArrowUpRight, Check, CornerDownLeft } from 'geist-native-icons';
import { useTheme } from '@shopify/restyle';
import Big from 'big.js';
import dayjs from 'dayjs';
import Animated, { useDerivedValue, FadeIn, FadeOut, StretchInY, StretchOutY } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

import styles from './styles/summary';
import { AccountsTabsScreenProps } from '@types';
import { Graph } from '@ledget/media/native';
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

const tempChartData = [
  { date: dayjs().startOf('month').subtract(3, 'month').format('YYYY-MM-DD'), balance: 1200 },
  { date: dayjs().startOf('month').subtract(2, 'month').format('YYYY-MM-DD'), balance: 2700 },
  { date: dayjs().startOf('month').subtract(1, 'month').format('YYYY-MM-DD'), balance: 2000 },
  { date: dayjs().startOf('month').format('YYYY-MM-DD'), balance: 4000 },
  { date: dayjs().format('YYYY-MM-DD'), balance: 5000 },
]

export default function Summary(props: AccountsTabsScreenProps<'Depository'>) {
  const { data: accountsData } = useGetAccountsQuery()
  const [getBalanceTrend, { data: balanceTrend }] = useLazyGetAccountBalanceTrendQuery()
  const [getBalanceHistory, { data: balanceHistory, isSuccess: isBalanceHistoryLoaded }] = useLazyGetAccountBalanceHistoryQuery()
  const { mode } = useAppearance();
  const theme = useTheme();
  const font = useFont(SourceSans3Regular, 14)

  const [window, setWindow] = useState<typeof windows[number]['key']>(windows[0].key)
  const [dateWindow, setDateWindow] = useState<{ start: number, end: number }>({ start: 0, end: 0 })
  const [calculatedTrend, setCalculatedTrend] = useState(0)
  const [balanceHistoryChartData, setBalanceHistoryChartData] = useState(tempChartData)
  const [showMenu, setShowMenu] = useState(false)
  const [showChart, setShowChart] = useState(false)
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
          .filter((t) => accountsData?.accounts.some((a) => a.id === t.account))
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
        accounts: accountsData?.accounts.map(a => a.id) || [],
      });
    }
  }, [accountsData, dateWindow]);

  useEffect(() => {
    if (accountsData?.accounts.length) {
      getBalanceTrend({
        type: props.route.name.toLowerCase() as any,
        accounts: accountsData.accounts.map(a => a.id),
      })
    }
  }, [accountsData])

  useEffect(() => {
    switch (window) {
      case '3M':
        setDateWindow({
          start: dayjs().startOf('day').subtract(3, 'month').unix(),
          end: dayjs().startOf('day').unix()
        });
        break;
      case '6M':
        setDateWindow({
          start: dayjs().startOf('day').subtract(6, 'month').unix(),
          end: dayjs().startOf('day').unix()
        });
        break;
      case '1Y':
        setDateWindow({
          start: dayjs().startOf('day').subtract(1, 'year').unix(),
          end: dayjs().startOf('day').unix()
        });
        break;
      case 'ALL':
        setDateWindow({
          start: dayjs().startOf('day').subtract(10, 'year').unix(),
          end: dayjs().startOf('day').unix()
        });
        break;
    }
  }, [window]);

  return (
    <Box style={styles.container}>
      {showMenu &&
        <Animated.View entering={FadeIn} exiting={FadeOut} style={[StyleSheet.absoluteFill, styles.blurViewContainer]}>
          <BlurView
            intensity={8}
            style={[StyleSheet.absoluteFill]}
            tint={mode === 'dark' ? 'dark' : 'light'}
          />
        </Animated.View>}
      <View style={styles.menuButtonContainer}>
        {showChart
          ?
          <Menu
            as='menu'
            onShowChange={setShowMenu}
            items={[
              ...windows.map(w => ({
                label: w.label,
                icon: () => <Icon icon={Check} color={window === w.key ? 'blueText' : 'transparent'} strokeWidth={2} />,
                onSelect: () => setWindow(w.key)
              })),
              {
                label: 'Close',
                icon: () => <Icon icon={CornerDownLeft} size={16} color='secondaryText' strokeWidth={2} />,
                onSelect: () => setShowChart(false), newSection: true
              }
            ]}
            placement='right'
            closeOnSelect={true}
          >
            <Box backgroundColor='lightBlueButton' style={styles.menuButton}>
              <Text color='blueText'>{window}</Text>
            </Box>
          </Menu>
          :
          <Button
            onPress={() => { setShowChart(true) }}
            backgroundColor='grayButton'
            variant='square'>
            <Icon icon={Graph} color='secondaryText' />
          </Button>
        }
      </View>
      <View style={styles.chartHeader}>
        <Text color='tertiaryText'>Total Balance</Text>
        <View style={styles.balanceData}>
          <DollarCents value={totalBalance} fontSize={24} variant='bold' color='secondaryText' />
          <View style={styles.trendContainer}>
            <DollarCents showSign={false} color='tertiaryText' value={calculatedTrend} withCents={false} />
            <View style={styles.trendIcon}>
              <Icon
                size={18}
                color={calculatedTrend < 0 ? 'alert' : 'greenText'}
                icon={calculatedTrend < 0 ? ArrowDownRight : ArrowUpRight} />
            </View>
          </View>
        </View>
      </View>
      {showChart &&
        <Animated.View style={[styles.graphContainer]} entering={StretchInY} exiting={StretchOutY}>
          <CartesianChart
            chartPressState={state}
            data={balanceHistoryChartData}
            xKey={'date'}
            yKeys={['balance']}
            xAxis={{
              font,
              lineWidth: 0,
              labelOffset: -20,
              tickCount: window.endsWith('M') ? 3 : 5,
              labelColor:
                isBalanceHistoryLoaded
                  ? theme.colors.faintBlueText
                  : theme.colors.quaternaryText,
              formatXLabel: (date) => window.endsWith('M')
                ? `      ${dayjs(date).format('MMM')}`
                : `         ${dayjs(date).format('MMM YY')}`,
            }}
            yAxis={[{
              font,
              lineWidth: 0,
              tickCount: 0,
              formatYLabel: () => '',
            }]}
            padding={{
              left: 0,

              bottom: 24
            }}
            domainPadding={{ left: 3, right: 3 }}
            domain={{
              y: [
                balanceHistoryChartData.reduce((acc, h) => Math.min(acc, h.balance), 0) * 1.25 -
                (balanceHistoryChartData.reduce((acc, h) => Math.max(acc, h.balance), 0) * 1.25
                  - balanceHistoryChartData.reduce((acc, h) => Math.min(acc, h.balance), 0) * 1.25) * .2,
                balanceHistoryChartData.reduce((acc, h) => Math.max(acc, h.balance), 0) * 1.25
              ]
            }}
          >
            {({ points, chartBounds }) => (
              <>
                <Line
                  animate={{ type: 'spring', duration: 300 }}
                  points={points.balance}
                  color={isBalanceHistoryLoaded ? theme.colors.blueChartColor : theme.colors.quinaryText}
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
                    colors={isBalanceHistoryLoaded
                      ? [
                        theme.colors.blueChartGradientStart,
                        theme.colors.blueChartGradientStart,
                        theme.colors.blueChartGradientEnd
                      ]
                      : [
                        theme.colors.mediumGrayButton,
                        theme.colors.mediumGrayButton,
                        mode === 'dark' ? 'hsla(0, 0%, 0%, 0)' : 'hsla(0, 0%, 100%, 0)'
                      ]
                    }
                    start={vec(chartBounds.bottom, 0)}
                    end={vec(chartBounds.bottom, chartBounds.bottom)}
                  />
                </Area>
                {isActive && (
                  <SkText
                    x={textXPosition}
                    y={textYPosition}
                    font={font}
                    color={theme.colors.faintBlueText}
                    text={value}
                  />
                )}
                {isActive && (
                  <Circle
                    cx={state.x.position}
                    cy={state.y.balance.position}
                    r={3}
                    color={theme.colors.faintBlueText}
                  />
                )}
              </>
            )}
          </CartesianChart>
        </Animated.View>}
    </Box>
  )
}
