import Animated, { FadeOut, FadeIn } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { View } from 'react-native';

import styles from './styles/header';
import { AccountsScreenProps, AccountsTabsScreenProps } from '@types';
import { Header, Header2, InstitutionLogo, DollarCents } from '@ledget/native-ui';
import { Account } from '@ledget/shared-features';

const headerMap = {
  'Deposits': 'Accounts',
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
      style={[styles.headerContainer, { top: -1 * theme.spacing.statusBar }]}
    >
      <View style={[styles.header, { top: theme.spacing.statusBar * 2 }]}>
        <InstitutionLogo account={props.account.account_id} />
        <Header2>{props.account.name}</Header2>
        <View style={styles.balanceContainer}>
          <DollarCents value={props.account.balances.current} fontSize={20} />
        </View>
      </View>
    </Animated.View>
  )
}

export const DefaultHeader = (props: AccountsTabsScreenProps<any> | AccountsScreenProps<any>) => {
  const theme = useTheme()

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.headerContainer, { top: -1 * theme.spacing.statusBar }]}
    >
      <View style={[styles.header, { top: theme.spacing.statusBar * 2 }]}>
        <Header>{`Your ${(headerMap as any)[props.route.name]}`}</Header>
      </View>
    </Animated.View>
  )
}
