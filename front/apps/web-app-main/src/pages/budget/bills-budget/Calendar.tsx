import { useMemo, forwardRef } from 'react';

import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@hooks/store';
import dayjs from 'dayjs';

import styles from './styles/calendar.module.scss';
import {
  selectBudgetMonthYear,
  useGetBillsQuery,
} from '@ledget/shared-features';

const Calendar = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { month, year } = useAppSelector(selectBudgetMonthYear);
    const { data: bills } = useGetBillsQuery(
      { month, year },
      { skip: !month || !year }
    );

    const selectedDate = dayjs()
      .month(
        parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`) -
          1
      )
      .year(
        parseInt(searchParams.get('year') || `${new Date().getFullYear()}`)
      );

    const monthlyBillCountEachDay: number[] = useMemo(() => {
      const counts: number[] = Array(31).fill(0);
      const numBills = bills?.length || 0;
      for (let i = 0; i < numBills; i++) {
        if (bills?.[i].period !== 'month') {
          continue;
        }
        const date = new Date(bills[i].date!);
        counts[date.getDate() - 1] += 1;
      }
      return counts;
    }, [bills]);

    const yearlyBillCountEachDay: number[] = useMemo(() => {
      const counts: number[] = Array(31).fill(0);
      const numBills = bills?.length || 0;
      for (let i = 0; i < numBills; i++) {
        if (bills?.[i].period !== 'year') {
          continue;
        }
        const date = new Date(bills![i].date!);
        counts[date.getDate() - 1] += 1;
      }
      return counts;
    }, [bills]);

    return (
      <div className={styles.calendar} ref={ref}>
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
        {Array.from({ length: selectedDate.date(1).day() }).map((_, i) => (
          <div key={i} className={styles.bookendDays}>
            {selectedDate.subtract(1, 'month').endOf('month').date() -
              selectedDate.date(1).day() +
              i +
              1}
          </div>
        ))}
        {Array.from({ length: selectedDate.daysInMonth() }).map((day, i) => {
          const djs = dayjs(selectedDate).date(i + 1);
          return (
            // Cell
            <div
              key={i}
              data-hoverable={
                monthlyBillCountEachDay[i] > 0 || yearlyBillCountEachDay[i] > 0
              }
              data-selected={
                searchParams.get('day') &&
                searchParams.get('day') === `${djs.date()}`
                  ? true
                  : false
              }
              tabIndex={
                monthlyBillCountEachDay[i] > 1 || yearlyBillCountEachDay[i] > 1
                  ? 0
                  : -1
              }
              role={
                monthlyBillCountEachDay[i] > 1 || yearlyBillCountEachDay[i] > 1
                  ? 'button'
                  : undefined
              }
              aria-label={`${djs.format('MMMM YYYY')} bills`}
              onClick={() => {
                searchParams.get('day') &&
                searchParams.get('day') === `${djs.date()}`
                  ? searchParams.delete('day')
                  : searchParams.set('day', `${djs.date()}`);
                setSearchParams(searchParams);
              }}
            >
              <span>{djs.date()}</span>
              {(monthlyBillCountEachDay[i] > 1 ||
                yearlyBillCountEachDay[i] > 1) && (
                <div role="tooltip" className={styles.billDotTip}>
                  {monthlyBillCountEachDay[i] > 0 && (
                    <>
                      <span data-period="month" />
                      <span>{monthlyBillCountEachDay[i]}</span>
                    </>
                  )}
                  {yearlyBillCountEachDay[i] > 0 && (
                    <>
                      <span data-period="year" />
                      <span>{yearlyBillCountEachDay[i]}</span>
                    </>
                  )}
                </div>
              )}
              {/* Below cell */}
              {(monthlyBillCountEachDay[i] > 0 ||
                yearlyBillCountEachDay[i] > 0) && (
                <div className={styles.billDotContainer}>
                  {monthlyBillCountEachDay[i] > 0 && (
                    <span data-period="month" className={styles.billDot} />
                  )}
                  {yearlyBillCountEachDay[i] > 0 && <span data-period="year" />}
                </div>
              )}
            </div>
          );
        })}
        {Array.from({
          length: 6 - selectedDate.date(selectedDate.daysInMonth()).day(),
        }).map((_, i) => (
          <div key={i} className={styles.bookendDays}>
            {i + 1}
          </div>
        ))}
      </div>
    );
  }
);

export default Calendar;
