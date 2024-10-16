import { useEffect, useState } from 'react';
import Animated, { FadeOut, FadeIn } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { View } from 'react-native';
import Big from 'big.js';

import styles from './styles/header';
import { Header2, Header, InstitutionLogo, DollarCents } from '@ledget/native-ui';
import { Account } from '@ledget/shared-features';
import { useAppSelector } from '@/hooks';
import { selectDepositsScreenAccounts } from '@/features/uiSlice';
import store from '@/features/store';

const headerMap = {
  'Depository': 'Accounts',
  'Credit': 'Cards',
  'Investment': 'Investments',
  'Loan': 'Loans'
}

export const AccountHeader = (props: { account: Account }) => {
  const theme = useTheme()

  const [accounts, setAccounts] = useState<Account[]>()
  const storedAccounts = useAppSelector(selectDepositsScreenAccounts)

  useEffect(() => {
    if (props.account) {
      setAccounts([props.account])
    } else {
      setAccounts(storedAccounts)
    }
  }, [storedAccounts, props.account])

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.headerContainer, styles.accountHeaderContainer, { paddingTop: theme.spacing.statusBar }]}
    >
      <View style={styles.logos}>
        {accounts?.map(a => (
          <View style={styles.logo}>
            <InstitutionLogo key={a.id} account={a.id} />
          </View>
        ))}
      </View>
      {(accounts?.length || 0) < 2 &&
        <Header2>
          {accounts?.[0].name}
        </Header2>}
      <View style={styles.balanceContainer}>
        <DollarCents
          value={accounts?.reduce((acc, a) => Big(acc).plus(a.balances.current), Big(0)).times(100).toNumber() || 0}
          fontSize={20}
        />
      </View>
    </Animated.View>
  )
}

export const DefaultHeader = (props: { routeName: string }) => {
  const theme = useTheme()

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.headerContainer, styles.defaultHeaderContainer, { paddingTop: theme.spacing.statusBar }]}
    >
      <Header>{`Your ${(headerMap as any)[props.routeName]}`}</Header>
    </Animated.View>
  )
}
