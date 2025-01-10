import { useState, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import LottieView from 'react-lottie';

import styles from './styles/month-picker.module.scss';
import { DatePicker } from '@ledget/ui';
import {
  setBudgetMonthYear,
  selectBudgetMonthYear,
  useGetMeQuery,
} from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { calendar } from '@ledget/media/lotties';

export const MonthPicker = ({
  size = 'small',
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
  const [animateLottie, setAnimateLottie] = useState(false);
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

  const animationOptions = {
    loop: false,
    autoplay: animateLottie,
    animationData: calendar,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className={styles.picker}>
      <div className={styles.container} data-size={size}>
        <button
          aria-haspopup="true"
          onMouseEnter={() => setAnimateLottie(true)}
          onMouseLeave={() => setAnimateLottie(false)}
          onClick={(e) => setShowDatePicker(!showDatePicker)}
        >
          <LottieView
            options={animationOptions}
            direction={animateLottie ? 1 : -1}
            speed={1}
            style={{ width: 32, height: 32 }}
          />
          <h2>{date?.format('MMMM YYYY')}</h2>
        </button>
      </div>
      <DatePicker
        placement={'left'}
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
