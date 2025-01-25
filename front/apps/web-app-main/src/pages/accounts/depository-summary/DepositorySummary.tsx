import { useEffect, useMemo, useState } from 'react';
import Big from 'big.js';

import styles from './styles/depository-summary.module.scss';
import {
  useGetAccountsQuery,
  useLazyGetAccountBalanceTrendQuery,
} from '@ledget/shared-features';
import { DollarCents, Window, TrendNumber } from '@ledget/ui';
import Chart from './Chart';
import PinnedAccounts from './PinnedAccounts';

const DepositorySummary = () => {
  const { data: accountsData } = useGetAccountsQuery();
  const [getBalanceTrend, { data: balanceTrend }] =
    useLazyGetAccountBalanceTrendQuery();
  const [calculatedTrend, setCalculatedTrend] = useState(0);

  const totalBalance = useMemo(
    () =>
      accountsData?.accounts
        .filter((a) => a.type === 'depository')
        .reduce((acc, account) => acc.plus(account.balances.current), Big(0))
        .times(100)
        .toNumber() || 0,
    [accountsData]
  );

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
    if (accountsData?.accounts.length) {
      getBalanceTrend({
        type: 'depository',
        accounts: accountsData.accounts.map((a) => a.id),
      });
    }
  }, [accountsData]);

  return (
    <div className={styles.container}>
      <Window>
        <h4>Total Balance</h4>
        <div className={styles.balanceData}>
          <h2>
            <DollarCents value={totalBalance} fontSize={24} variant="bold" />
          </h2>
          <TrendNumber value={calculatedTrend} isCurrency={true} />
        </div>
        <Chart />
      </Window>
      <PinnedAccounts />
    </div>
  );
};

export default DepositorySummary;
