import { useEffect, useState, HTMLProps, useRef } from 'react';

import { useLocation, useSearchParams } from 'react-router-dom';
import { Dayjs } from 'dayjs';

import styles from './styles/table.module.scss';
import {
  useLazyGetTransactionsQuery,
  GetTransactionsResponse,
} from '@ledget/shared-features';
import {
  InfiniteScrollDiv,
  ShadowScrollDiv,
  useScreenContext,
  Window,
} from '@ledget/ui';
import { useLoaded } from '@ledget/helpers';

import pathMappings from '../path-mappings';
import Filter from './TransactionsFilter';
import Skeleton from './Skeleton';

type Props = Omit<HTMLProps<HTMLDivElement>, 'children'> & {
  children: ({
    transactionsData,
  }: {
    transactionsData?: GetTransactionsResponse;
  }) => React.ReactNode;
};

const Table = ({ children, ...rest }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fetchMorePulse, setFetchMorePulse] = useState(false);
  const [searchParams] = useSearchParams();
  const loaded = useLoaded(0);
  const location = useLocation();
  const { screenSize } = useScreenContext();
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>();

  const [getTransactions, { data: transactionsData }] =
    useLazyGetTransactionsQuery();

  // Initial fetch
  useEffect(() => {
    if (searchParams.get('account')) {
      getTransactions(
        {
          account: searchParams.get('account') || '',
          type: pathMappings.getTransactionType(location),
          limit: 25,
          offset: 0,
          ...(dateRange
            ? {
                start: Math.floor(dateRange[0].valueOf() / 1000),
                end: Math.floor(dateRange[1].valueOf() / 1000),
              }
            : {}),
        },
        true
      );
    }
  }, [searchParams.get('account'), dateRange]);

  // Fetch more transactions
  const handleScroll = (e: any) => {
    const bottom = e.target.scrollTop === e.target.scrollTopMax;
    // Update cursors to add new transactions node to the end
    if (bottom && transactionsData?.next !== null && transactionsData) {
      setFetchMorePulse(true);
      getTransactions({
        account: searchParams.get('account')!,
        type: pathMappings.getTransactionType(location),
        offset: transactionsData.next,
        limit: transactionsData.limit,
        ...(dateRange
          ? {
              start_date: dateRange[0].format('YYYY-MM-DD'),
              end_date: dateRange[1].format('YYYY-MM-DD'),
            }
          : {}),
      });

      setTimeout(() => {
        setFetchMorePulse(false);
      }, 1500);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer} data-size={screenSize}>
        <Filter value={dateRange} onChange={setDateRange} />
      </div>
      <Window
        className={styles.table}
        ref={containerRef}
        data-size={screenSize}
      >
        <InfiniteScrollDiv animate={loaded && fetchMorePulse} {...rest}>
          <ShadowScrollDiv
            className={styles.list}
            data-size={screenSize}
            onScroll={handleScroll}
          >
            {!transactionsData && <Skeleton ref={containerRef} />}
            {children({ transactionsData })}
          </ShadowScrollDiv>
        </InfiniteScrollDiv>
      </Window>
    </div>
  );
};

export default Table;
