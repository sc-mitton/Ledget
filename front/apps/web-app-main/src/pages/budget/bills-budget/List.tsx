import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@hooks/store';
import { CheckCircle, Circle } from '@geist-ui/icons';

import styles from './styles/list.module.scss';
import { useAppDispatch } from '@hooks/store';
import {
  selectBudgetMonthYear,
  useGetBillsQuery,
} from '@ledget/shared-features';
import { setBillModal } from '@features/modalSlice';
import { DollarCents, BillCatLabel, useScreenContext } from '@ledget/ui';
import { useSortContext } from '../context';

const List = ({ collapsed }: { collapsed: boolean }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data: bills } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  );
  const { billsSort: sort } = useSortContext();

  const { screenSize } = useScreenContext();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  return (
    <div
      className={styles.list}
      data-size={screenSize}
      aria-expanded={!collapsed}
      style={
        {
          '--number-of-bills': bills?.length! / 2 || 0,
          ...(bills?.length || 0 <= 10 ? {} : {}),
        } as React.CSSProperties
      }
    >
      {bills
        ?.filter(
          (bill) =>
            new Date(bill.date).getDate() ===
            (parseInt(searchParams.get('day')!) ||
              new Date(bill.date).getDate())
        )
        .sort((a, b) => {
          switch (sort) {
            case 'alpha-asc':
              return a.name.localeCompare(b.name);
            case 'alpha-des':
              return b.name.localeCompare(a.name);
            case 'limit-asc':
              return a.upper_amount - b.upper_amount;
            case 'limit-des':
              return b.upper_amount - a.upper_amount;
            default:
              return 0;
          }
        })
        .map((bill, i) => {
          return (
            <div
              key={i}
              className={`${bill.period}ly-bill`}
              role="button"
              onClick={() => {
                dispatch(setBillModal({ bill: bill }));
              }}
            >
              <BillCatLabel
                labelName={bill.name}
                emoji={bill.emoji}
                slim={true}
                color={bill.period === 'month' ? 'blue' : 'green'}
              >
                <span>
                  {new Date(bill.date)
                    .toLocaleString('en-us', {
                      month: 'numeric',
                      day: 'numeric',
                    })
                    .replace('/', '-')}
                </span>
              </BillCatLabel>
              <div>
                <DollarCents value={bill.upper_amount} />
              </div>
              <div
                className={styles.check}
                data-period={bill.period}
                data-paid={bill.is_paid}
              >
                {bill.is_paid ? (
                  <CheckCircle size={'1em'} />
                ) : (
                  <Circle size={'1em'} />
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default List;
