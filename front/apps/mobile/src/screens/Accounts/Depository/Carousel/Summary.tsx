import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { ArrowUpRight, ArrowDownRight } from 'geist-native-icons';
import Big from 'big.js';

import styles from './styles/summary';
import { Text, DollarCents, Icon } from '@ledget/native-ui';
import { useGetAccountsQuery, useLazyGetAccountBalanceTrendQuery } from '@ledget/shared-features';
import { AccountsTabsScreenProps } from '@types';

const Summary = (props: AccountsTabsScreenProps<'Depository'>) => {
  const { data } = useGetAccountsQuery()
  const [getBalanceTrend, { data: balanceTrend }] = useLazyGetAccountBalanceTrendQuery()

  const totalBalance = useMemo(
    () =>
      data?.accounts
        .filter((a) => a.type === props.route.name.toLowerCase())
        .reduce((acc, account) => acc.plus(account.balances.current), Big(0))
        .times(100)
        .toNumber() || 0,
    [data]
  )

  const calculatedTrend = useMemo(
    () =>
      balanceTrend?.trends
        .filter((t) => data?.accounts.some((a) => a.account_id === t.account))
        .reduce((acc, trend) => acc.plus(trend.trend), Big(0))
        .times(100)
        .toNumber() || 0,
    [balanceTrend, data]
  );

  useEffect(() => {
    if (data?.accounts.length) {
      getBalanceTrend({
        type: props.route.name.toLowerCase() as any,
        accounts: data.accounts.map(a => a.account_id),
      })
    }
  }, [])

  return (
    <View style={styles.content}>
      <View style={styles.titleContainer}>
        <Text color='secondaryText' fontSize={14}>
          Total Deposits
        </Text>
      </View>
      <View style={styles.numbers}>
        <DollarCents fontSize={32} value={totalBalance} />
        <View style={styles.trendContainer}>
          <DollarCents value={calculatedTrend} withCents={false} />
          <View style={styles.trendIcon}>
            <Icon
              color={calculatedTrend >= 0 ? 'greenText' : 'alert'}
              icon={calculatedTrend >= 0 ? ArrowUpRight : ArrowDownRight}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
export default Summary
