import { useMemo } from 'react';
import Big from 'big.js';
import { TrendingUp } from 'geist-native-icons';

import { CurrencyNote } from '@ledget/media/native';
import { Box, Text, DollarCents, Icon, TrendNumber } from '@ledget/native-ui';
import { useGetAccountsQuery } from '@ledget/shared-features';
import { View } from 'react-native';

// Window 1

// - Saved over the last six month
// - Invested over the last six months
// - Projected Leftovers

const Summary = () => {
  const { data: accountsData } = useGetAccountsQuery();

  const totalDeposits = useMemo(() => {
    return accountsData?.accounts
      .filter((account) => account.type === 'depository')
      .reduce((acc, account) => {
        return acc + account.balances.current;
      }, 0);
  }, [accountsData]);

  const totalInvestments = useMemo(() => {
    return accountsData?.accounts
      .filter((account) => account.type === 'investment')
      .reduce((acc, account) => {
        return acc + account.balances.current;
      }, 0);
  }, [accountsData]);

  return (
    <Box variant="nestedContainer" flexDirection="column">
      <Box flexDirection="row" gap="s" padding="l">
        <Box flex={1} flexDirection="column" alignItems="flex-start">
          <Box flexDirection="row" alignItems="center" gap="s">
            <Icon icon={CurrencyNote} color="tertiaryText" />
            <Text color="tertiaryText">Deposits</Text>
          </Box>
          <View>
            <DollarCents
              fontSize={24}
              variant="bold"
              value={Big(totalDeposits || 0)
                .times(100)
                .toNumber()}
            />
          </View>
          <Box
            flexDirection="row"
            alignItems="center"
            gap="s"
            backgroundColor="grayButton"
            paddingHorizontal="s"
            paddingVertical="xxs"
            marginTop="xs"
            borderRadius="s"
            marginLeft="ns"
          >
            <TrendNumber value={0} isCurrency={true} color="secondaryText" />
            <Text color="secondaryText">6 mon</Text>
          </Box>
        </Box>
        <Box flex={1} flexDirection="column" alignItems="flex-start">
          <Box flexDirection="row" alignItems="center" gap="s">
            <Icon icon={TrendingUp} color="tertiaryText" />
            <Text color="tertiaryText">Investments</Text>
          </Box>
          <View>
            <DollarCents
              fontSize={24}
              variant="bold"
              value={Big(totalInvestments || 0)
                .times(100)
                .toNumber()}
            />
          </View>
          <Box
            flexDirection="row"
            alignItems="center"
            gap="s"
            backgroundColor="grayButton"
            paddingHorizontal="s"
            paddingVertical="xxs"
            marginTop="xs"
            borderRadius="s"
            marginLeft="ns"
          >
            <TrendNumber value={0} isCurrency={true} color="secondaryText" />
            <Text color="secondaryText">6 mon</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default Summary;
