import Animated, { FadeOut, FadeIn } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { View } from 'react-native';

import styles from './styles/header';
import { AccountsScreenProps, AccountsTabsScreenProps } from '@types';
import { Header, Header2, InstitutionLogo, DollarCents } from '@ledget/native-ui';
import { Account } from '@ledget/shared-features';

const headerMap = {
  'Depository': 'Accounts',
  'Credit': 'Cards',
  'Investment': 'Investments',
  'Loan': 'Loans'
}

export const AccountHeader = (props: { account: Account }) => {
  const theme = useTheme()

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.headerContainer, { paddingTop: theme.spacing.statusBar }]}
    >
      <InstitutionLogo account={props.account.account_id} />
      <Header2>{props.account.name}</Header2>
      <View style={styles.balanceContainer}>
        <DollarCents value={props.account.balances.current} fontSize={20} />
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
