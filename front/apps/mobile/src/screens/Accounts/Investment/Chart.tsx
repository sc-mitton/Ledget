import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CartesianChart, Area, Line, useChartPressState } from 'victory-native';
import { LinearGradient, useFont, vec } from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
  withDelay,
  useSharedValue,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import {
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Check,
} from 'geist-native-icons';
import { Big } from 'big.js';
import dayjs from 'dayjs';

import styles from './styles/chart';
import SourceSans3Regular from '../../../../assets/fonts/SourceSans3Regular.ttf';
import tempDataValues from './tempChartData';
import {
  VictoryTooltip,
  Text,
  Menu,
  DollarCents,
  Icon,
  Box,
} from '@ledget/native-ui';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  useGetInvestmentsBalanceHistoryQuery,
  useGetInvestmentsQuery,
  isInvestmentSupported,
} from '@ledget/shared-features';
import {
  selectInvestmentsScreenAccounts,
  selectInvestmentsScreenWindow,
  setInvestmentsScreenAccounts,
  setInvestmentsScreenWindow,
} from '@/features/uiSlice';
import { ChartWindowsMenu } from '@/components';
import { useAppearance } from '@features/appearanceSlice';

const tempChartData = tempDataValues
  .map((d, i) => ({
    date: dayjs().subtract(i, 'days').format('YYYY-MM-DD'),
    balance: d,
  }))
  .reverse();

const windows = [
  {
    key: '1M',
    label: '1 month',
    period: 'month' as const,
    number: 1,
    format: 'MMM D',
    ticks: 5,
  },
  {
    key: '3M',
    label: '3 months',
    period: 'month' as const,
    number: 3,
    format: 'MMM D',
    ticks: 5,
  },
  {
    key: '6M',
    label: '6 months',
    period: 'month' as const,
    number: 6,
    format: 'MMM YYYY',
    ticks: 5,
  },
  {
    key: '1Y',
    label: '1 year',
    period: 'year' as const,
    number: 1,
    format: 'MMM YYYY',
    ticks: 5,
  },
  { key: 'MAX', label: 'Max', format: 'MMM YY', ticks: 5 },
];

const BOTTOM_PADDING = 50;

const Chart = () => {
  const dispatch = useAppDispatch();

  const accounts = useAppSelector(selectInvestmentsScreenAccounts);
  const window = useAppSelector(selectInvestmentsScreenWindow);

  const { data: fetchedData } = useGetInvestmentsBalanceHistoryQuery({
    end: dayjs().format('YYYY-MM-DD'),
    start: dayjs()
      .subtract(window?.amount || 100, window?.period || 'year')
      .format('YYYY-MM-DD'),
  });
  const { data: investmentsData } = useGetInvestmentsQuery(
    {
      end: dayjs().format('YYYY-MM-DD'),
      start: dayjs()
        .subtract(window?.amount || 100, window?.period || 'year')
        .format('YYYY-MM-DD'),
    },
    {
      skip: !window,
    }
  );

  const { mode } = useAppearance();

  const [chartData, setChartData] = useState(tempChartData);
  const [useingFakeData, setUseingFakeData] = useState(true);
  const [blurView, setBlurView] = useState<number>();
  const chartMenuZindex = useSharedValue(0);
  const accountMenuZindex = useSharedValue(0);

  const font = useFont(SourceSans3Regular, 14);
  const theme = useTheme();
  const { state, isActive } = useChartPressState({ x: '0', y: { balance: 0 } });

  const chartMenuAnimation = useAnimatedStyle(() => ({
    zIndex: chartMenuZindex.value,
  }));

  const accountMenuAnimation = useAnimatedStyle(() => ({
    zIndex: accountMenuZindex.value,
  }));

  const trend = useMemo(() => {
    if (fetchedData?.length === 0 || !fetchedData) return undefined;
    const last = fetchedData
      .filter((acnt) =>
        accounts ? accounts.some((ac) => ac.id === acnt.account_id) : true
      )
      .reduce((acc, acnt) => {
        return acc.plus(acnt.balances[0]?.value || 0);
      }, Big(0));
    const second2Last = fetchedData
      .filter((acnt) =>
        accounts ? accounts.some((ac) => ac.id === acnt.account_id) : true
      )
      .reduce((acc, acnt) => {
        return acc.plus(acnt.balances[1]?.value || 0);
      }, Big(0));
    return last.minus(second2Last).times(100).toNumber();
  }, [fetchedData]);

  useEffect(() => {
    if (blurView === 1) {
      chartMenuZindex.value = 20;
      accountMenuZindex.value = 0;
    } else if (blurView === 2) {
      accountMenuZindex.value = 20;
      chartMenuZindex.value = 0;
    } else {
      chartMenuZindex.value = withDelay(withTiming(0, { duration: 0 }), 0);
      accountMenuZindex.value = withDelay(withTiming(0, { duration: 0 }), 0);
    }
  }, [blurView]);

  useEffect(() => {
    if (fetchedData && fetchedData.length > 0) {
      setChartData(
        fetchedData
          .filter((acnt) =>
            accounts ? accounts.some((ac) => ac.id === acnt.account_id) : true
          )
          .reduce((acc, acnt) => {
            return acnt.balances
              .map((b) => ({
                date: b.date,
                balance: b.value,
              }))
              .concat(acc);
          }, [] as { date: string; balance: number }[])
      );
      setUseingFakeData(false);
    }
  }, [accounts]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.windowMenu, chartMenuAnimation]}>
        <ChartWindowsMenu
          disabled={useingFakeData}
          windows={windows}
          onShowChange={(show) =>
            show ? setBlurView(1) : setBlurView(undefined)
          }
          onSelect={(w) => {
            dispatch(
              setInvestmentsScreenWindow({
                period: windows.find((win) => win.key === w)?.period || 'year',
                amount: windows.find((win) => win.key === w)?.number || 5,
              })
            );
          }}
          defaultWindow={
            window
              ? windows.find(
                  (w) =>
                    w.period === window?.period && w.number === window?.amount
                )?.key || windows[windows.length - 1].key
              : windows[0].key
          }
        />
      </Animated.View>
      <Animated.View style={[styles.accountMenu, accountMenuAnimation]}>
        <Menu
          as="menu"
          placement="left"
          closeOnSelect={true}
          onShowChange={(show) =>
            show ? setBlurView(2) : setBlurView(undefined)
          }
          items={[
            ...(investmentsData?.results
              .filter((a) => isInvestmentSupported(a))
              .map((a) => ({
                label: a.account_name,
                icon: () => (
                  <Icon
                    icon={Check}
                    size={16}
                    strokeWidth={2}
                    color={
                      accounts?.some((ac) => ac.id === a.account_id)
                        ? 'blueText'
                        : 'transparent'
                    }
                  />
                ),
                onSelect: () =>
                  dispatch(
                    setInvestmentsScreenAccounts([
                      { id: a.account_id, name: a.account_name },
                    ])
                  ),
              })) || []),
            {
              label: 'All Accounts',
              icon: () => (
                <Icon
                  icon={Check}
                  strokeWidth={2}
                  color={accounts ? 'transparent' : 'blueText'}
                />
              ),
              onSelect: () => dispatch(setInvestmentsScreenAccounts(undefined)),
            },
          ]}
        >
          <Text color="tertiaryText">
            {accounts ? accounts[0]?.name : 'All Accounts'}
            &nbsp;
            <Icon
              icon={ChevronDown}
              size={16}
              strokeWidth={2}
              color="tertiaryText"
            />
          </Text>
        </Menu>
        <View style={styles.balanceContainer}>
          <DollarCents
            fontSize={24}
            variant="bold"
            value={
              investmentsData?.results
                .filter((a) => isInvestmentSupported(a))
                .reduce((acc, investment) => {
                  if (accounts) {
                    return accounts?.some(
                      (ac) => ac.id === investment.account_id
                    )
                      ? acc.plus(investment.balance)
                      : acc;
                  }
                  return acc.plus(investment.balance);
                }, Big(0))
                ?.times(100)
                .toNumber() || 0
            }
          />
          {trend !== undefined && (
            <View style={styles.trendContainer}>
              <DollarCents
                color="tertiaryText"
                value={trend}
                withCents={false}
              />
              <Icon
                icon={trend >= 0 ? ArrowUpRight : ArrowDownRight}
                size={16}
                strokeWidth={2}
                color={trend >= 0 ? 'greenText' : 'alert'}
              />
            </View>
          )}
        </View>
      </Animated.View>
      {Number.isFinite(blurView) && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            StyleSheet.absoluteFill,
            styles.blurViewContainer,
            { zIndex: blurView },
          ]}
        >
          <BlurView
            intensity={12}
            style={[StyleSheet.absoluteFill]}
            tint={mode === 'dark' ? 'systemUltraThinMaterialDark' : 'light'}
          />
          <Box
            backgroundColor="mainBackground"
            style={[StyleSheet.absoluteFill, { opacity: 0.8 }]}
          />
        </Animated.View>
      )}
      {useingFakeData && (
        <View style={styles.emptyTextContainer}>
          <Text variant="footer" style={styles.emptyText}>
            Not enough data yet
          </Text>
        </View>
      )}
      <View style={styles.chartContainer}>
        <CartesianChart
          chartPressState={state}
          data={chartData}
          xKey={'date'}
          yKeys={['balance']}
          xAxis={{
            font,
            lineWidth: 0,
            labelOffset: -20,
            tickCount: 0,
            labelColor: useingFakeData
              ? theme.colors.quaternaryText
              : theme.colors.faintBlueText,
            formatXLabel: (date) => '',
          }}
          yAxis={[
            {
              font,
              lineWidth: 0,
              tickCount: 0,
              formatYLabel: () => '',
            },
          ]}
          padding={{ left: 0 }}
          domainPadding={{ left: 6, right: 6, top: 50, bottom: BOTTOM_PADDING }}
        >
          {({ points, chartBounds }) => {
            return (
              <>
                <Area
                  y0={chartBounds.bottom}
                  points={points.balance}
                  animate={{ type: 'spring', duration: 300 }}
                  curveType="natural"
                >
                  <LinearGradient
                    colors={
                      useingFakeData
                        ? [
                            theme.colors.emptyChartGradientStart,
                            theme.colors.blueChartGradientEnd,
                          ]
                        : [
                            theme.colors.blueChartGradientStart,
                            theme.colors.blueChartGradientStart,
                            theme.colors.blueChartGradientEnd,
                          ]
                    }
                    start={vec(chartBounds.bottom, 0)}
                    end={vec(chartBounds.bottom, chartBounds.bottom)}
                  />
                </Area>
                <Line
                  animate={{ type: 'spring', duration: 300 }}
                  points={points.balance}
                  color={
                    useingFakeData
                      ? theme.colors.emptyChartColor
                      : theme.colors.blueChartColor
                  }
                  strokeWidth={2}
                  strokeCap="round"
                  curveType="natural"
                />
                {isActive && !useingFakeData && (
                  <VictoryTooltip
                    state={state}
                    isActive={state.isActive}
                    font={font}
                    chartBounds={chartBounds}
                    xAxisTipColor={theme.colors.tertiaryText}
                    dotColor={theme.colors.blueText}
                    borderColor={theme.colors.lightBlueButton}
                    backgroundColor={theme.colors.tooltip}
                    color={theme.colors.whiteText}
                    lineOffset={-20}
                  />
                )}
              </>
            );
          }}
        </CartesianChart>
      </View>
    </View>
  );
};

export default Chart;
