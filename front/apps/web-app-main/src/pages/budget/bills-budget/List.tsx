import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Circle } from '@geist-ui/icons';

import styles from './styles/list.module.scss';
import { useAppDispatch } from '@hooks/store';
import {
  selectBudgetMonthYear,
  useGetBillsQuery,
  selectBillOrder,
} from '@ledget/shared-features';
import { setModal } from '@features/modalSlice';
import { DollarCents, BillCatLabel, useScreenContext } from '@ledget/ui';
import { useAppSelector } from '@hooks/store';

const List = () => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data: bills } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  );
  const order = useAppSelector(selectBillOrder);

  const { screenSize } = useScreenContext();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  return (
    <div
      className={styles.list}
      data-size={screenSize}
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
          switch (order) {
            case 'nameAsc':
              return a.name.localeCompare(b.name);
            case 'nameDesc':
              return b.name.localeCompare(a.name);
            case 'amountAsc':
              return a.upper_amount - b.upper_amount;
            case 'amountDesc':
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
                dispatch(setModal({ name: 'bill', args: { bill: bill } }));
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
