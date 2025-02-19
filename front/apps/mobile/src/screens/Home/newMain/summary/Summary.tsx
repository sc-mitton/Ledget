import { useMemo, useEffect, useState } from 'react';
import Big from 'big.js';
import { TrendingUp } from 'geist-native-icons';
import dayjs from 'dayjs';

import { CurrencyNote } from '@ledget/media/native';
import { Box, Text, DollarCents, Icon, TrendNumber } from '@ledget/native-ui';
import {
  useGetAccountsQuery,
  useGetInvestmentsBalanceHistoryQuery,
  useLazyGetTransactionsQuery,
  selectBudgetMonthYear,
} from '@ledget/shared-features';
import { View } from 'react-native';
import { useAppSelector } from '@/hooks';
import Skeleton from './Skeleton';

// Window 1

// - Saved over the last six month
// - Invested over the last six months
// - Projected Leftovers

const Summary = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data: accountsData } = useGetAccountsQuery();
  const { data: investmentsData } = useGetInvestmentsBalanceHistoryQuery({
    end: dayjs().format('YYYY-MM-DD'),
    start: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
  });
  const [getIncomeTransactions, { data: incomeTransactionsData }] =
    useLazyGetTransactionsQuery();
  const [getInvestmentTransactions, { data: investmentTransactionsData }] =
    useLazyGetTransactionsQuery();
  const [getSpendingTransactions, { data: spendingTransactionsData }] =
    useLazyGetTransactionsQuery();

  useEffect(() => {
    if (month && year) {
      getIncomeTransactions({
        month,
        year,
        detail: 'income',
      });
      getInvestmentTransactions({
        month,
        year,
        detail: 'investment_transfer_out',
      });
      getSpendingTransactions({
        month,
        year,
        detail: 'spending',
      });
    }
  }, [month, year]);

  const totalDeposits = useMemo(() => {
    return accountsData?.accounts
      .filter((account) => account.type === 'depository')
      .reduce((acc, account) => {
        return acc + account.balances.current;
      }, 0);
  }, [accountsData]);

  const totalInvestments = useMemo(() => {
    return investmentsData
      ?.reduce(
        (acc, accountBalanceData) =>
          Big(acc).plus(accountBalanceData.balances[0].value),
        Big(0)
      )
      .toNumber();
  }, [investmentsData]);

  // Income - Spending - Investments
  const changeInDeposits = useMemo(() => {
    if (
      !incomeTransactionsData ||
      !spendingTransactionsData ||
      !investmentTransactionsData
    ) {
      return Big(0);
    }
    return incomeTransactionsData?.results
      ?.reduce((acc, transaction) => {
        return acc.plus(transaction.amount);
      }, Big(0))
      .minus(
        spendingTransactionsData?.results?.reduce((acc, transaction) => {
          return acc.plus(transaction.amount);
        }, Big(0)) || Big(0)
      )
      .minus(
        investmentTransactionsData?.results?.reduce((acc, transaction) => {
          return acc.plus(transaction.amount);
        }, Big(0)) || Big(0)
      )
      .round(0);
  }, [
    incomeTransactionsData,
    spendingTransactionsData,
    investmentTransactionsData,
  ]);

  const changeInInvestments = useMemo(() => {
    if (!investmentTransactionsData) {
      return Big(0);
    }
    return investmentTransactionsData?.results
      ?.reduce((acc, transaction) => {
        return acc.plus(transaction.amount);
      }, Big(0))
      .round(0);
  }, [investmentTransactionsData]);

  useEffect(() => {
    if (
      incomeTransactionsData &&
      investmentTransactionsData &&
      investmentsData &&
      accountsData
    ) {
      setShowSkeleton(false);
    }
  }, [
    incomeTransactionsData,
    investmentTransactionsData,
    investmentsData,
    accountsData,
  ]);

  return (
    <Box variant="nestedContainer" flexDirection="column" marginTop="none">
      {showSkeleton ? (
        <Skeleton />
      ) : (
        <Box flexDirection="row" gap="m" padding="l">
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
              marginTop="s"
              borderRadius="s"
              marginLeft="ns"
            >
              <Text color="secondaryText">6 mon</Text>
              <TrendNumber
                accuracy={0}
                value={changeInDeposits?.toNumber() || 0}
                isCurrency={true}
                color="secondaryText"
              />
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
              marginTop="s"
              borderRadius="s"
              marginLeft="ns"
            >
              <Text color="secondaryText">6 mon</Text>
              <TrendNumber
                accuracy={0}
                value={changeInInvestments?.toNumber() || 0}
                isCurrency={true}
                color="secondaryText"
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default Summary;
