import { Fragment } from 'react';
import { Pin, TrendingUp } from 'geist-native-icons';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Clock, CreditCard } from 'geist-native-icons';

import {
  Box,
  Icon,
  Text,
  Button,
  InstitutionLogo,
  DollarCents,
  Seperator,
} from '@ledget/native-ui';
import { CurrencyNote } from '@ledget/media/native';
import {
  useGetAccountsQuery,
  selectHomePinnedAccounts,
} from '@ledget/shared-features';
import { useAppSelector } from '@/hooks';
import { sliceString, capitalize } from '@ledget/helpers';
import { HomeScreenProps } from '@/types';
import Skeleton from './Skeleton';

const PinnedAccounts = (props: HomeScreenProps<'Main'>) => {
  const { data: accountsData, isSuccess } = useGetAccountsQuery();
  const pinnedAccounts = useAppSelector(selectHomePinnedAccounts);

  return (
    <Animated.View layout={LinearTransition}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="ns"
      >
        <Box alignItems="center" flexDirection="row" gap="xs">
          <Icon icon={Pin} size={16} color="tertiaryText" />
          <Text color="tertiaryText">Accounts</Text>
        </Box>
        <Button
          label="Edit"
          textColor="blueText"
          onPress={() => {
            props.navigation.navigate('PageSheetModals', {
              screen: 'PickHomeAccounts',
            });
          }}
        />
      </Box>
      <Box variant="nestedContainer" flexDirection="column" gap="m">
        {!isSuccess ? (
          <Skeleton />
        ) : pinnedAccounts.length === 0 ? (
          <Skeleton />
        ) : (
          accountsData?.accounts
            .filter((account) => pinnedAccounts.includes(account.id))
            .map((account, index) => (
              <Fragment key={account.id}>
                {index !== 0 && (
                  <Seperator
                    backgroundColor="nestedContainerSeperator"
                    variant="xs"
                  />
                )}
                <Button
                  flexDirection="row"
                  alignItems="center"
                  padding="none"
                  onPress={() => {
                    const screen = capitalize(account.type) as any;
                    props.navigation.navigate('BottomTabs', {
                      screen: 'Accounts',
                      params: {
                        screen: 'AccountsTabs',
                        params: {
                          screen: screen,
                          params: { accounts: [account] },
                        },
                      },
                    });
                  }}
                >
                  <Box marginRight="m">
                    <InstitutionLogo account={account.id} />
                  </Box>
                  <Box>
                    <Text>{sliceString(account.name, 20)}</Text>
                    <Box flexDirection="row" gap="s" alignItems="center">
                      {account.type === 'credit' && (
                        <Icon
                          icon={CreditCard}
                          size={14}
                          strokeWidth={2}
                          color="tertiaryText"
                        />
                      )}
                      {account.type === 'loan' && (
                        <Icon icon={Clock} size={14} color="tertiaryText" />
                      )}
                      {account.type === 'investment' && (
                        <Icon
                          icon={TrendingUp}
                          size={14}
                          strokeWidth={2}
                          color="tertiaryText"
                        />
                      )}
                      {account.type === 'depository' && (
                        <Icon
                          icon={CurrencyNote}
                          size={14}
                          strokeWidth={2}
                          color="tertiaryText"
                        />
                      )}
                      <Text color="tertiaryText" fontSize={14}>
                        {capitalize(account.type)}
                      </Text>
                      <Text color="tertiaryText" fontSize={14}>
                        &bull;&nbsp;&bull;&nbsp;{account.mask}
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    flex={1}
                    flexGrow={1}
                    flexDirection="row"
                    justifyContent="flex-end"
                  >
                    <DollarCents value={account.balances.current} />
                  </Box>
                </Button>
              </Fragment>
            ))
        )}
      </Box>
    </Animated.View>
  );
};

export default PinnedAccounts;
