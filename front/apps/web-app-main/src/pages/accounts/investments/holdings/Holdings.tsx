import { useState, useEffect } from 'react';
import { ChevronRight } from '@geist-ui/icons';
import dayjs from 'dayjs';
import Big from 'big.js';

import styles from './styles.module.scss';
import { TextButton, Window, DollarCents, TrendNumber } from '@ledget/ui';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { selectWindow, selectAccounts } from '@features/investmentsTabSlice';
import {
  useGetInvestmentsQuery,
  isInvestmentSupported,
  Holding,
  selectTrackedHoldings,
  selectPinnedHoldings,
} from '@ledget/shared-features';
import { setModal } from '@features/modalSlice';

const Holdings = () => {
  const dispatch = useAppDispatch();
  const [holdings, setHoldings] = useState<Holding[]>();

  const window = useAppSelector(selectWindow);
  const { data: investmentsData } = useGetInvestmentsQuery(
    {
      end: dayjs().format('YYYY-MM-DD'),
      start: dayjs()
        .subtract(window?.amount || 100, window?.period || 'year')
        .format('YYYY-MM-DD'),
    },
    {
      skip: !window,
    }
  );
  const accounts = useAppSelector(selectAccounts);
  const trackedHoldings = useAppSelector(selectTrackedHoldings);
  const pinnedHoldings = useAppSelector(selectPinnedHoldings);

  useEffect(() => {
    const newHoldings = investmentsData?.results
      .reduce((acc, i) => {
        if (
          isInvestmentSupported(i) &&
          (!accounts || accounts?.some((a) => a.id === i.account_id))
        ) {
          return acc.concat(i.holdings);
        }
        return acc;
      }, [] as Holding[])
      .sort((a, b) => {
        if (
          pinnedHoldings?.some((p) => p.security_id === a.security_id || '') &&
          !pinnedHoldings?.some((p) => p.security_id === b.security_id || '')
        ) {
          return -1;
        } else if (
          !pinnedHoldings?.some((p) => p.security_id === a.security_id || '') &&
          pinnedHoldings?.some((p) => p.security_id === b.security_id || '')
        ) {
          return 1;
        } else {
          return 0;
        }
      });
    setHoldings(newHoldings);
  }, [pinnedHoldings, investmentsData, accounts]);

  return (
    <div className={styles.container}>
      <Window className={styles.table}>
        <div>
          <TextButton onClick={() => dispatch(setModal({ name: 'holdings' }))}>
            <div>
              Holdings
              <ChevronRight className="icon small" strokeWidth={2} />
            </div>
          </TextButton>
        </div>
        <div>
          {holdings?.map((holding, index) => {
            let previous_institution_value,
              current_institution_value,
              percent_change: number | undefined = undefined;

            if (
              holding.security_id &&
              trackedHoldings[holding.security_id].length > 1
            ) {
              previous_institution_value =
                trackedHoldings[holding.security_id][
                  trackedHoldings[holding.security_id].length - 1
                ].institution_value;
              current_institution_value =
                trackedHoldings[holding.security_id][
                  trackedHoldings[holding.security_id].length - 1
                ].institution_value;
              percent_change = Big(current_institution_value)
                .minus(previous_institution_value)
                .div(previous_institution_value)
                .times(100)
                .toNumber();
            }

            return (
              <div className={styles.holding} key={`$holding-${index}`}>
                <div className={styles.holdingTitle}>
                  <span>
                    {holding.security.ticker_symbol
                      ? holding.security.ticker_symbol?.slice(0, 6)
                      : '—'}
                  </span>
                  {percent_change !== undefined ? (
                    <TrendNumber value={percent_change} suffix={'%'} />
                  ) : (
                    <span>—</span>
                  )}
                </div>
                {holding.institution_value && (
                  <DollarCents
                    value={Big(holding.institution_value).times(100).toNumber()}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Window>
    </div>
  );
};

export default Holdings;
