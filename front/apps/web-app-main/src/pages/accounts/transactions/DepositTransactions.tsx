import { Fragment } from 'react';

import { Outlet } from 'react-router-dom';
import Big from 'big.js';
import dayjs from 'dayjs';

import styles from './styles/deposit-transactions.module.scss';
import { setTransactionModal } from '@features/modalSlice';
import { useAppDispatch } from '@hooks/store';
import { Tooltip, DollarCents } from '@ledget/ui';
import { Hourglass } from '@ledget/media';
import Table from './Table';

const Transactions = () => {
  const dispatch = useAppDispatch();

  return (
    <Table>
      {({ transactionsData }) => {
        return (
          <>
            {transactionsData &&
              transactionsData.results?.map((transaction, i) => {
                const date = dayjs(transaction.date);
                const previousDate =
                  i > 0 ? dayjs(transactionsData.results[i - 1].date) : null;

                return (
                  <Fragment key={transaction.transaction_id}>
                    <div>
                      {!previousDate ||
                      date.month() !== previousDate.month() ? (
                        <span>{date.format('MMM')}</span>
                      ) : (
                        <span></span>
                      )}
                      {!previousDate || date.year() !== previousDate.year() ? (
                        <span>{date.format('YYYY')}</span>
                      ) : (
                        <span></span>
                      )}
                    </div>
                    <div
                      className={styles.transaction}
                      key={transaction.transaction_id}
                      role="button"
                      onClick={() => {
                        dispatch(setTransactionModal({ item: transaction }));
                      }}
                    >
                      <div>
                        <div>
                          {transaction.pending && (
                            <Tooltip msg="Pending" type="right">
                              <Hourglass className="icon" />
                            </Tooltip>
                          )}
                          <span>
                            {transaction.preferred_name || transaction.name}
                          </span>
                        </div>
                        <div>
                          <span>{date.format('M/D/YY')}</span>
                          {transaction.categories?.map((c, index) => (
                            <span key={index}>{c.emoji}</span>
                          ))}
                        </div>
                      </div>
                      <div data-debit={transaction.amount < 0}>
                        <div>
                          <DollarCents
                            value={Big(transaction.amount)
                              .times(100)
                              .toNumber()}
                          />
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
          </>
        );
      }}
    </Table>
  );
};

export default function () {
  return (
    <>
      <Transactions />
      <Outlet />
    </>
  );
}
