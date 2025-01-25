import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ArrowUp, ArrowDown, Pin } from '@geist-ui/icons';
import Big from 'big.js';

import styles from './styles/holdings.module.scss';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import {
  useGetInvestmentsQuery,
  isInvestmentSupported,
  Holding,
  selectTrackedHoldings,
  usePinHoldingMutation,
  useUnPinHoldingMutation,
  selectPinnedHoldings,
  pinHolding,
  unPinHolding,
} from '@ledget/shared-features';
import { selectAccounts, selectWindow } from '@features/investmentsTabSlice';
import { InstitutionLogo } from '@components/pieces';
import {
  withModal,
  TextButton,
  DollarCents,
  Tooltip,
  CircleIconButton,
  TrendNumber,
} from '@ledget/ui';

const Row = ({
  holding,
  account,
  index,
}: {
  holding: Holding;
  account: string;
  index: number;
}) => {
  const [isPinned, setIsPinned] = useState(false);
  const [pinHoldingMutate] = usePinHoldingMutation();
  const [unPinHoldingMutate] = useUnPinHoldingMutation();
  const dispatch = useAppDispatch();

  const trackedHoldings = useAppSelector(selectTrackedHoldings);
  const pinnedHoldings = useAppSelector(selectPinnedHoldings);
  const [percentChange, setPercentChange] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    let previous_institution_value,
      current_institution_value: number | undefined = undefined;

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
      setPercentChange(
        Big(current_institution_value)
          .minus(previous_institution_value)
          .div(previous_institution_value)
          .times(100)
          .toNumber()
      );
    }
  }, []);

  useEffect(() => {
    setIsPinned(
      pinnedHoldings?.some(
        (p) => p.security_id === holding.security_id || ''
      ) || false
    );
  }, [pinnedHoldings]);

  return (
    <div className={styles.row}>
      {isPinned && (
        <div className={styles.pinBox}>
          <TextButton className={styles.pinButton}>
            <Pin className={'icon'} />
          </TextButton>
        </div>
      )}
      {!isPinned && (
        <CircleIconButton
          className={styles.pinButton}
          darker={true}
          onClick={() => {
            if (isPinned) {
              pinHoldingMutate(holding.security_id || '');
              dispatch(pinHolding(holding.security_id || ''));
            } else {
              unPinHoldingMutate(holding.security_id || '');
              dispatch(unPinHolding(holding.security_id || ''));
            }
          }}
        >
          <Pin className="icon" />
        </CircleIconButton>
      )}
      <div>
        <InstitutionLogo accountId={account} size={'1.5em'} />
      </div>
      <div className={styles.nameContainer}>
        <span>
          <span>{holding.security.name}</span>
          &nbsp;&nbsp;&nbsp;
          {holding.security.ticker_symbol && (
            <div className={styles.tickerSymbol}>
              <span>{holding.security.ticker_symbol?.toUpperCase()}</span>
            </div>
          )}
        </span>
      </div>
      <div className={styles.amountContainer}>
        {holding.institution_value ? (
          <DollarCents
            value={Big(holding.institution_value).times(100).toNumber()}
          />
        ) : (
          <span>—</span>
        )}
        {percentChange === undefined ? (
          <span>&nbsp;&nbsp;&mdash;</span>
        ) : (
          <TrendNumber suffix="%" value={percentChange} />
        )}
      </div>
    </div>
  );
};

const Holdings = withModal((props) => {
  const accounts = useAppSelector(selectAccounts);
  const window = useAppSelector(selectWindow);
  const pinnedHoldings = useAppSelector(selectPinnedHoldings);

  const [holdings, setHoldings] = useState<(Holding & { account: string })[]>();
  const [sort, setSort] = useState<
    'amountDesc' | 'amountAsc' | 'nameDesc' | 'nameAsc' | 'default'
  >('default');

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

  useEffect(() => {
    const newHoldings = investmentsData?.results
      .reduce((acc, i) => {
        if (
          isInvestmentSupported(i) &&
          (!accounts || accounts?.some((a) => a.id === i.account_id))
        ) {
          return acc.concat(
            i.holdings.map((h) => ({ ...h, account: i.account_id }))
          );
        }
        return acc;
      }, [] as (Holding & { account: string })[])
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
        } else if (sort === 'amountAsc') {
          return (
            (a.institution_value || Number.MAX_SAFE_INTEGER) -
            (b.institution_value || Number.MAX_SAFE_INTEGER)
          );
        } else if (sort === 'amountDesc') {
          return (b.institution_value || 0) - (a.institution_value || 0);
        } else if (sort === 'nameAsc') {
          return (a.security.name || 'z').localeCompare(b.security.name || 'z');
        } else if (sort === 'nameDesc') {
          return (b.security.name || 'a').localeCompare(a.security.name || 'a');
        } else {
          return 0;
        }
      });

    setHoldings(newHoldings);
  }, [pinnedHoldings, sort]);

  return (
    <div>
      <h2>Holdings</h2>
      <div className={styles.tableHeader}>
        <button
          onClick={() =>
            setSort(
              sort === 'nameAsc'
                ? 'nameDesc'
                : sort === 'nameDesc'
                ? 'default'
                : 'nameAsc'
            )
          }
          data-sorted={sort.toLowerCase().includes('name')}
        >
          <div>
            Name
            {sort === 'nameAsc' ? (
              <ArrowUp className={'icon'} />
            ) : (
              <ArrowDown className={'icon'} />
            )}
          </div>
        </button>
        <button
          onClick={() =>
            setSort(
              sort === 'amountDesc'
                ? 'amountAsc'
                : sort === 'amountAsc'
                ? 'default'
                : 'amountDesc'
            )
          }
          data-sorted={sort.toLowerCase().includes('amount')}
        >
          <Tooltip
            delay={0.7}
            maxWidth={'40ch'}
            msg={'The value of the holding, as reported by the institution.'}
          >
            Value
            {sort === 'amountAsc' ? (
              <ArrowUp className={'icon'} />
            ) : (
              <ArrowDown className={'icon'} />
            )}
          </Tooltip>
        </button>
      </div>
      <div className={styles.list}>
        {holdings?.map((holding, index) => (
          <Row
            key={holding.security_id}
            holding={holding}
            account={holding.account}
            index={index}
          />
        ))}
      </div>
    </div>
  );
});

export default Holdings;
