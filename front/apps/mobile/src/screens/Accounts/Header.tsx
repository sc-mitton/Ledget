import Animated, { FadeOut, FadeIn } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { View } from 'react-native';
import { Plus } from 'geist-native-icons';
import Big from 'big.js';

import styles from './styles/header';
import { Header2, Header, InstitutionLogo, DollarCents, Icon, Text } from '@ledget/native-ui';
import { Account } from '@ledget/shared-features';
import { useAppSelector } from '@/hooks';
import { selectDepositsScreenAccounts } from '@/features/uiSlice';

const headerMap = {
  'Depository': 'Accounts',
  'Credit': 'Cards',
  'Investment': 'Investments',
  'Loan': 'Loans'
}

export const AccountHeader = () => {
  const theme = useTheme()
  const accounts = useAppSelector(selectDepositsScreenAccounts)

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
