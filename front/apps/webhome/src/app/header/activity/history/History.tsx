import { useEffect, useState, Fragment } from 'react';

import dayjs from 'dayjs';
import { ChevronRight } from '@geist-ui/icons';

import styles from './styles/history.module.scss';
import { FilterForm } from './Filter';
import { setTransactionModal } from '@features/modalSlice';
import {
  useLazyGetTransactionsQuery,
  useGetTransactionsQuery,
  selectFilteredFetchedConfirmedTransactions,
} from '@ledget/shared-features';
import { InsitutionLogo, ZeroConfig } from '@components/pieces';
import {
  DollarCents,
  InfiniteScrollDiv,
  LoadingRingDiv,
  BillCatEmojiLabel,
  ShadowedContainer,
} from '@ledget/ui';
import { useAppSelector, useAppDispatch } from '@hooks/store';
import { useFilterFormContext } from '../context';
import { useGetStartEndQueryParams } from '@hooks/utilHooks';

export function History() {
  const [isFetchingMore, setFetchingMore] = useState(false);
  const { start, end } = useGetStartEndQueryParams();
  const { showFilterForm } = useFilterFormContext();

  const { isError } = useGetTransactionsQuery(
    { confirmed: true, start, end },
    { skip: !start || !end }
  );
  const transactionsData = useAppSelector(
    selectFilteredFetchedConfirmedTransactions
  );
  const dispatch = useAppDispatch();
  const [getTransactions, { data: fetchedTransactionData, isLoading }] =
    useLazyGetTransactionsQuery();
  let monthholder: number | undefined;
  let newMonth = false;

  // Initial transaction fetch
  useEffect(() => {
    if (!start || !end) return;
    getTransactions({ confirmed: true, start, end }, true);
  }, [start, end]);

  // Refetches for pagination
  const handleScroll = (e: any) => {
    setFetchingMore(true);
    const bottom = e.target.scrollTop === e.target.scrollTopMax;
    // Update cursors to add new transactions node to the end
    if (bottom && fetchedTransactionData?.next) {
      getTransactions({
        confirmed: true,
        offset: fetchedTransactionData.next,
        limit: fetchedTransactionData.limit,
        start,
        end,
      });
    }
    setFetchingMore(false);
  };

  return (
    <div className={styles.allItemsWindow}>
      {showFilterForm ? (
        <FilterForm />
      ) : (
        <ShadowedContainer className={styles.transactionsHistoryTableContainer}>
          <LoadingRingDiv loading={isLoading}>
            {!transactionsData?.length && !isLoading && !isError ? (
              <ZeroConfig />
            ) : (
              <InfiniteScrollDiv
                animate={isFetchingMore}
                className={styles.transactionsHistoryTable}
                data-skeleton={isLoading}
                onScroll={handleScroll}
              >
                {transactionsData?.map((transaction) => {
                  const date = new Date(
                    transaction.datetime || transaction.date
                  );
                  date.getUTCMonth() !== monthholder
                    ? (newMonth = true)
                    : (newMonth = false);
                  monthholder = date.getUTCMonth();
                  return (
                    <Fragment key={transaction.transaction_id}>
                      <div className={styles.monthHeader}>
                        {newMonth && (
                          <div>
                            {date.toLocaleString('default', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        )}
                      </div>
                      <div
                        role="button"
                        onClick={() =>
                          dispatch(setTransactionModal({ item: transaction }))
                        }
                      >
                        <div>
                          <InsitutionLogo
                            accountId={transaction.account}
                            size={'1.25em'}
                          />
                        </div>
                        <div>
                          {transaction.preferred_name?.slice(0, 20) ||
                            transaction.name.slice(0, 20)}
                          {`${
                            (transaction.preferred_name &&
                              transaction.preferred_name?.length > 20) ||
                            transaction.name.length > 20
                              ? '...'
                              : ''
                          }`}
                        </div>
                        <div>
                          {dayjs(
                            transaction.datetime || transaction.date
                          ).format('M/D/YYYY')}
                        </div>
                        <div>
                          {transaction.bill && (
                            <BillCatEmojiLabel
                              emoji={transaction.bill.emoji}
                              name={transaction.bill.name}
                              color={
                                transaction.bill.period === 'month'
                                  ? 'blue'
                                  : 'green'
                              }
                            />
                          )}
                          {transaction.categories?.map((category) => (
                            <BillCatEmojiLabel
                              emoji={category.emoji}
                              name={category.name}
                              color={
                                category.period === 'month' ? 'blue' : 'green'
                              }
                            />
                          ))}
                        </div>
                        <div
                          className={`${transaction.amount < 0 ? 'debit' : ''}`}
                        >
                          <div>
                            <DollarCents value={transaction.amount} />
                          </div>
                          <ChevronRight className="icon" />
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </InfiniteScrollDiv>
            )}
          </LoadingRingDiv>
        </ShadowedContainer>
      )}
    </div>
  );
}
