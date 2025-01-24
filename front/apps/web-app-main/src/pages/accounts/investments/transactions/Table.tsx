import { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft } from '@geist-ui/icons';
import dayjs from 'dayjs';

import styles from './styles/list.module.scss';
import Skeleton from './Skeleton';
import { useColorScheme, Window } from '@ledget/ui';
import { useLoaded } from '@ledget/helpers';
import {
  isInvestmentSupported,
  useLazyGetInvestmentsQuery,
} from '@ledget/shared-features';
import { selectWindow } from '@features/investmentsTabSlice';
import { useAppSelector } from '@hooks/store';
import {
  ShadowScrollDiv,
  InfiniteScrollDiv,
  useScreenContext,
} from '@ledget/ui';
import { EmptyBox } from '@ledget/media';
import List from './List';

const Table = () => {
  const [getInvestments, { data: investmentsData }] =
    useLazyGetInvestmentsQuery();

  const [fetchMorePulse, setFetchMorePulse] = useState(false);
  const loaded = useLoaded(0);
  const { screenSize } = useScreenContext();
  const window = useAppSelector(selectWindow);
  const { isDark } = useColorScheme();

  const skeletonRef = useRef<HTMLDivElement>(null);

  // Fetch more
  const handleScroll = (e: any) => {
    // If at the bottom of the scroll view, fetch more transactions
    const bottom = e.target.scrollTop === e.target.scrollTopMax;

    if (bottom && investmentsData?.cursor) {
      getInvestments(
        {
          end: dayjs().format('YYYY-MM-DD'),
          start: dayjs()
            .subtract(window?.amount || 100, window?.period || 'year')
            .format('YYYY-MM-DD'),
          cursor: investmentsData.cursor,
        },
        true
      );
    }
  };

  useEffect(() => {
    if (window) {
      getInvestments(
        {
          end: dayjs().format('YYYY-MM-DD'),
          start: dayjs()
            .subtract(window?.amount || 100, window?.period || 'year')
            .format('YYYY-MM-DD'),
        },
        true
      );
    }
  }, [window]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Transactions</h4>
        <h4>
          <ArrowDownLeft strokeWidth={2} className="icon" />
          Buy
          <ArrowUpRight strokeWidth={2} className="icon" />
          Sell
        </h4>
      </div>
      <Window className={styles.table} ref={skeletonRef}>
        <InfiniteScrollDiv animate={loaded && fetchMorePulse}>
          <ShadowScrollDiv
            className={styles.list}
            data-size={screenSize}
            onScroll={handleScroll}
          >
            {!investmentsData && <Skeleton ref={skeletonRef} />}
            {investmentsData && <List data={investmentsData} />}
            {investmentsData &&
              investmentsData.results.filter((a) => isInvestmentSupported(a))
                .length === 0 && (
                <span className={styles.empty}>
                  <EmptyBox size={32} dark={isDark} />
                  <span>No Transactions</span>
                </span>
              )}
          </ShadowScrollDiv>
        </InfiniteScrollDiv>
      </Window>
    </div>
  );
};

export default Table;
