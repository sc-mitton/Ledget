import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Big from 'big.js';
import dayjs from 'dayjs';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

import styles from './styles/summary';
import { AccountsTabsScreenProps } from '@types';
import { Box, DollarCents, Icon, Text, TrendNumber } from '@ledget/native-ui';
import {
  useGetAccountsQuery,
  useLazyGetAccountBalanceHistoryQuery,
  useLazyGetAccountBalanceTrendQuery,
} from '@ledget/shared-features';
import { useAppearance } from '@/features/appearanceSlice';
import { ChartWindowsMenu } from '@/components';
import { tempDepositBalanceChartData, chartWindows } from '@constants';
import { useAppSelector } from '@/hooks';
import { selectAccountsTabDepositAccounts } from '@/features/uiSlice';
import Chart from './Chart';

export default function Summary(props: AccountsTabsScreenProps<'Depository'>) {
  const { data: accountsData } = useGetAccountsQuery();
  const [getBalanceTrend, { data: balanceTrend }] =
    useLazyGetAccountBalanceTrendQuery();
  const [getBalanceHistory, { data: balanceHistory }] =
    useLazyGetAccountBalanceHistoryQuery();

  const { mode } = useAppearance();

  const storedAccounts = useAppSelector(selectAccountsTabDepositAccounts);
  const [window, setWindow] = useState<(typeof chartWindows)[number]['key']>(
    chartWindows[0].key
  );
  const [isShowingMenu, setIsShowingMenu] = useState(false);
  const [dateWindow, setDateWindow] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  const [calculatedTrend, setCalculatedTrend] = useState(0);
  const [balanceHistoryChartData, setBalanceHistoryChartData] =
    useState<typeof tempDepositBalanceChartData>();

  const totalBalance = useMemo(
    () =>
      accountsData?.accounts
        .filter((a) => a.type === props.route.name.toLowerCase())
        .reduce((acc, account) => acc.plus(account.balances.current), Big(0))
        .times(100)
        .toNumber() || 0,
    [accountsData]
  );

  useEffect(() => {
    if (balanceHistory) {
      const chartData = balanceHistory
        .reduce(
          (acc, balance) => {
            return acc.map((h, i) => ({
              date: h.date,
              balance: Big(h.balance || 0)
                .plus(balance.history[i]?.balance || 0)
                .toNumber(),
            }));
          },
          balanceHistory[0].history.map((h) => ({ date: h.month, balance: 0 }))
        )
        .reverse();
      if (chartData.length < 2) return;
      setBalanceHistoryChartData(chartData);
    }
  }, [balanceHistory]);

  useEffect(() => {
    if (balanceTrend && (accountsData?.accounts.length || 0 > 0)) {
      setCalculatedTrend(
        balanceTrend.trends
          .filter((t) => accountsData?.accounts.some((a) => a.id === t.account))
          .reduce((acc, trend) => acc.plus(trend.trend), Big(0))
          .times(100)
          .toNumber() || 0
      );
    }
  }, [balanceTrend, accountsData]);

  useEffect(() => {
    if (dateWindow.start && dateWindow.end && storedAccounts) {
      getBalanceHistory({
        start: dateWindow.start,
        end: dateWindow.end,
        type: props.route.name.toLowerCase() as any,
        accounts: storedAccounts?.map((a) => a.id) || ['*'],
      });
    }
  }, [dateWindow, storedAccounts]);

  useEffect(() => {
    if (accountsData?.accounts.length) {
      getBalanceTrend({
        type: props.route.name.toLowerCase() as any,
        accounts: ['*'],
      });
    }
  }, [accountsData]);

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
      case 'ALL':
        setDateWindow({
          start: dayjs().startOf('day').subtract(10, 'year').unix(),
          end: dayjs().startOf('day').unix(),
        });
        break;
    }
  }, [window]);

  return (
    <Box style={styles.container}>
      {isShowingMenu && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[StyleSheet.absoluteFill, styles.blurViewContainer]}
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
      <View style={styles.menuButtonContainer}>
        <ChartWindowsMenu
          windows={chartWindows}
          onSelect={(w) => {
            setWindow(w);
            setIsShowingMenu(false);
          }}
          onShowChange={setIsShowingMenu}
        />
      </View>
      <View style={styles.chartHeader}>
        <Text color="secondaryText">Total Balance</Text>
        <View style={styles.balanceData}>
          <DollarCents value={totalBalance} fontSize={24} variant="bold" />
          <TrendNumber
            value={Big(calculatedTrend).div(100).toNumber()}
            color="secondaryText"
            isCurrency={true}
          />
        </View>
      </View>
      <View style={[styles.graphContainer]}>
        <Chart data={balanceHistoryChartData} />
      </View>
    </Box>
  );
}
