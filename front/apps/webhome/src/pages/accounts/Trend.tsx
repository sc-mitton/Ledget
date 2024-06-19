import { useMemo, useEffect } from 'react';

import styles from './styles/trend.module.scss';
import { useLocation } from 'react-router-dom';
import Big from 'big.js';

import { useLazyGetAccountBalanceTrendQuery } from '@ledget/shared-features';
import { Tooltip, DollarCents } from '@ledget/ui';
import { ArrowUpRight, ArrowDownLeft } from '@geist-ui/icons';
import pathMappings from './path-mappings';
import { useAccountsContext } from './context';

const Trend = () => {
  const { accounts } = useAccountsContext();
  const location = useLocation();
  const [getBalanceTrend, { data: accountBalanceTrend }] =
    useLazyGetAccountBalanceTrendQuery();

  useEffect(() => {
    if (accounts?.length) {
      getBalanceTrend(
        {
          type: pathMappings.getAccountType(location) as
            | 'depository'
            | 'investment',
          accounts: accounts?.map((account) => account.account_id)
        },
        true
      );
    }
  }, [location.pathname, accounts]);

  const total = useMemo(
    () =>
      accountBalanceTrend?.trends
        .filter((t) => accounts?.some((a) => a.account_id === t.account))
        .reduce((acc, trend) => acc.plus(trend.trend), Big(0))
        .times(100)
        .toNumber() || 0,
    [accountBalanceTrend, accounts]
  );

  return (
    <div
      className={styles.accountBalanceTrend}
      data-trend={total >= 0 ? 'positive' : 'negative'}
    >
      <Tooltip msg={'Last 30 days'} delay={0}>
        <DollarCents value={total} withCents={false} />
      </Tooltip>
      {total >= 0 ? (
        <ArrowUpRight className="icon" />
      ) : (
        <ArrowDownLeft className="icon" />
      )}
    </div>
  );
};

export default Trend;
