import Animated, { FadeOut, FadeIn } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { View } from 'react-native';
import Big from 'big.js';

import styles from './styles/header';
import { Text, Header, InstitutionLogo, DollarCents } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import {
  selectAccountsTabDepositAccounts,
  selectAccountsTabCreditAccounts,
} from '@/features/uiSlice';
import { Account } from '@ledget/shared-features';
import { useId } from 'react';

const headerMap = {
  Depository: 'Accounts',
  Credit: 'Cards',
  Investment: 'Investments',
  Loan: 'Loans',
};

export const AccountHeader = ({
  accountType,
}: {
  accountType: Account['type'];
}) => {
  const theme = useTheme();
  const id = useId();

  const depositAccounts = useAppSelector(selectAccountsTabDepositAccounts);
  const creditAccounts = useAppSelector(selectAccountsTabCreditAccounts);

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        styles.headerContainer,
        styles.accountHeaderContainer,
        { paddingTop: theme.spacing.statusBar + 12 },
      ]}
    >
      <View style={styles.logos}>
        {(accountType === 'depository' ? depositAccounts : creditAccounts)?.map(
          (a) => (
            <View style={styles.logo} key={`${a.id}-${id}`}>
              <InstitutionLogo key={a.id} account={a.id} />
            </View>
          )
        )}
      </View>
      <View style={styles.accountHeaderText}>
        {((accountType === 'depository' ? depositAccounts : creditAccounts)
          ?.length || 0) < 2 && (
          <Text fontSize={18}>
            {
              (accountType === 'depository'
                ? depositAccounts
                : creditAccounts)?.[0].name
            }
          </Text>
        )}
        <View style={styles.balanceContainer}>
          <DollarCents
            value={
              (accountType === 'depository' ? depositAccounts : creditAccounts)
                ?.reduce((acc, a) => Big(acc).plus(a.balances.current), Big(0))
                .times(100)
                .toNumber() || 0
            }
            fontSize={18}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export const DefaultHeader = (props: { routeName: string }) => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        styles.headerContainer,
        styles.defaultHeaderContainer,
        { paddingTop: theme.spacing.statusBar },
      ]}
    >
      <Header>{`Your ${(headerMap as any)[props.routeName]}`}</Header>
    </Animated.View>
  );
};
