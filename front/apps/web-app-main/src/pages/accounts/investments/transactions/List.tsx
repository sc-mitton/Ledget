import { Fragment, useEffect, useId, useState } from 'react';

import Big from 'big.js';
import dayjs from 'dayjs';
import { ArrowDownLeft, ArrowUpRight } from '@geist-ui/icons';

import styles from './styles/list.module.scss';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { selectAccounts } from '@features/investmentsTabSlice';
import {
  isInvestmentSupported,
  InvestmentTransaction,
  InvestmentsResponse,
} from '@ledget/shared-features';
import { EmptyBox } from '@ledget/media';
import { DollarCents, useColorScheme, useScreenContext } from '@ledget/ui';
import { setModal } from '@features/modalSlice';

const List = ({ data: investmentsData }: { data: InvestmentsResponse }) => {
  const id = useId();
  const dispatch = useAppDispatch();
  const { isDark } = useColorScheme();
  const accounts = useAppSelector(selectAccounts);
  const [listItems, setListItems] = useState<InvestmentTransaction[]>();
  const [maxNameLength, setMaxNameLength] = useState(48);
  const { screenSize } = useScreenContext();

  useEffect(() => {
    switch (screenSize) {
      case 'medium':
        setMaxNameLength(36);
        break;
      case 'small':
        setMaxNameLength(32);
        break;
      case 'extra-small':
        setMaxNameLength(24);
        break;
      default:
        setMaxNameLength(48);
        break;
    }
  }, [screenSize]);

  useEffect(() => {
    setListItems(
      investmentsData.results
        ?.filter(
          (i) =>
            accounts === undefined ||
            accounts.some((a) => a.id === i.account_id)
        )
        .filter((i) => isInvestmentSupported(i))
        .reduce((acc, investment) => {
          return acc.concat(investment.transactions);
        }, [] as InvestmentTransaction[])
    );
  }, [investmentsData]);

  return (
    <>
      {listItems?.map((transaction, i) => {
        const date = dayjs(transaction.date);
        const previousDate = i > 0 ? dayjs(listItems[i - 1].date) : null;

        return (
          <Fragment key={`${id}-${i}`}>
            <div>
              {!previousDate || date.month() !== previousDate.month() ? (
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
              role="button"
              onClick={() => {
                dispatch(
                  setModal({
                    name: 'investmentTransaction',
                    args: { item: transaction },
                  })
                );
              }}
            >
              <div>
                <span>
                  {transaction.name?.toLocaleLowerCase().startsWith('buy') && (
                    <ArrowDownLeft className={'icon'} strokeWidth={2} />
                  )}
                  {transaction.name?.toLocaleLowerCase().startsWith('sell') && (
                    <ArrowUpRight className={'icon'} strokeWidth={2} />
                  )}
                  {(transaction.name || '').length > maxNameLength
                    ? (
                        transaction.name
                          ?.replace('BUY ', ' ')
                          .replace('SELL ', ' ') || ''
                      ).slice(0, maxNameLength) + '...'
                    : transaction.name
                        ?.replace('BUY ', ' ')
                        .replace('SELL ', ' ')}
                </span>
                <span>{dayjs(transaction.date).format('M/D/YY')}</span>
              </div>
              <div
                className={styles.amount}
                data-positive={
                  transaction.amount ? transaction.amount < 0 : false
                }
              >
                <DollarCents
                  isDebit={transaction.amount ? transaction.amount < 0 : false}
                  color={
                    (transaction.amount || 0) < 0 ? 'greenText' : 'mainText'
                  }
                  value={Big(transaction.amount || 0)
                    .times(100)
                    .toNumber()}
                />
              </div>
            </div>
          </Fragment>
        );
      })}
      {investmentsData && investmentsData.results.length === 0 && (
        <span className={styles.empty}>
          <EmptyBox size={32} dark={isDark} />
          <span>No Transactions</span>
        </span>
      )}
    </>
  );
};

export default List;
