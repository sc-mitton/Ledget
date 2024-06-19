import { useState, useEffect, useRef } from 'react';

import { useSearchParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { ChevronLeft, ChevronRight } from '@geist-ui/icons';

import styles from './styles/month-picker.module.scss';
import { DatePicker } from '@ledget/ui';
import {
  setBudgetMonthYear,
  selectBudgetMonthYear,
  useGetMeQuery
} from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@hooks/store';

export const MonthPicker = ({
  darkMode = false,
  placement = 'middle',
  size = 'small'
}: {
  darkMode?: boolean;
  placement?: 'left' | 'middle';
  size?: 'small' | 'medium';
}) => {
  const { data: user } = useGetMeQuery();

  const [date, setDate] = useState<Dayjs>();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { month, year } = useAppSelector(selectBudgetMonthYear);

  // Initial mount
  useEffect(() => {
    const y =
      parseInt(searchParams.get('year') || '') || year || dayjs().year();
    const m =
      parseInt(searchParams.get('month') || '') || month || dayjs().month() + 1;
    searchParams.set('month', `${m}`);
    searchParams.set('year', `${y}`);
    setSearchParams(searchParams);
    dispatch(setBudgetMonthYear({ month: m, year: y }));
  }, []);

  useEffect(() => {
    if (date) {
      searchParams.set('month', `${date.month() + 1}`);
      searchParams.set('year', `${date.year()}`);
      setSearchParams(searchParams);
      dispatch(
        setBudgetMonthYear({ month: date.month() + 1, year: date.year() })
      );
    }
  }, [date]);

  // On mount, select the month and year from the redux store
  // and set the date to the selected month and year or the curren month and year
  useEffect(() => {
    if (month && year) {
      setDate(
        dayjs()
          .year(year)
          .month(month - 1)
      );
    } else {
      setDate(dayjs());
    }
  }, [month, year]);

  const seek = (direction: 1 | -1, amount: 1 | 5) => {
    const newDjs = date?.add(direction * amount, 'month');
    if (direction === 1 && newDjs?.isBefore(dayjs())) {
      setDate(newDjs);
    } else if (direction === -1 && newDjs?.isAfter(dayjs(user?.created_on))) {
      setDate(newDjs);
    }
  };

  return (
    <div className={styles.picker}>
      <div
        className={styles.container}
        data-size={size}
        data-placement={placement}
      >
        {placement === 'middle' && (
          <button onClick={() => seek(-1, 1)}>
            <ChevronLeft size={'1.125em'} strokeWidth={2} />
          </button>
        )}
        <button
          aria-haspopup="true"
          onClick={(e) => setShowDatePicker(!showDatePicker)}
        >
          {date?.format('MMM YYYY')}
        </button>
        {placement === 'left' && (
          <button
            onClick={() => seek(-1, 1)}
            disabled={date?.add(-1, 'month').isBefore(dayjs(user?.created_on))}
          >
            <ChevronLeft size={'1.125em'} strokeWidth={1.5} />
          </button>
        )}
        <button
          onClick={() => seek(1, 1)}
          disabled={date?.add(1, 'month').isAfter(dayjs())}
        >
          <ChevronRight size={'1.125em'} strokeWidth={1.5} />
        </button>
      </div>
      <DatePicker
        placement={placement}
        period="month"
        hideInputElement={true}
        dropdownVisible={showDatePicker}
        disabled={[[undefined, dayjs(user?.created_on)]]}
        hidden={[[dayjs().add(1, 'month'), undefined]]}
        disabledStyle="muted"
        setDropdownVisible={setShowDatePicker}
        defaultValue={date}
        onChange={(date) => date && setDate(date)}
      />
    </div>
  );
};
