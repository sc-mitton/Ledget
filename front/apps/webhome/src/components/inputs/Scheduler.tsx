import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useContext,
  createContext
} from 'react';

import { UseFormRegister, FieldError } from 'react-hook-form';
import dayjs from 'dayjs';
import { Tab } from '@headlessui/react';
import { ChevronDown } from '@geist-ui/icons';
import { Calendar } from '@geist-ui/icons';

import dropdownStyles from './styles/dropdowns.module.scss';
import schedulerStyles from './styles/scheduler.module.scss';
import type { Bill } from '@ledget/shared-features';
import { useClickClose } from '@ledget/ui';
import { getDaySuffix } from '@ledget/helpers';
import {
  FormInputButton2,
  FormInputButton,
  FormErrorTip,
  DropdownDiv,
  useSchemeVar,
  TabNavList
} from '@ledget/ui';

interface Context extends Pick<Bill, 'day' | 'week' | 'month'> {
  open: boolean;
  weekDay: Bill['week_day'];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDay: React.Dispatch<React.SetStateAction<Bill['day']>>;
  setWeek: React.Dispatch<React.SetStateAction<Bill['week']>>;
  setWeekDay: React.Dispatch<React.SetStateAction<Bill['week_day']>>;
  setMonth: React.Dispatch<React.SetStateAction<Bill['month']>>;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const pickerContext = createContext<Context | null>(null);

const usePickerContext = () => {
  const context = useContext(pickerContext);
  if (!context) {
    throw new Error('usePickerContext must be used within a Scheduler');
  }
  return context;
};

const useResponsiveDropdownPlacement = ({
  ref
}: {
  ref: React.RefObject<HTMLDivElement>;
}) => {
  const [placement, setPlacement] = useState<'left' | 'right' | 'middle'>(
    'left'
  );
  const [verticlePlacement, setVerticlePlacement] = useState<'top' | 'bottom'>(
    'bottom'
  );

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      rect.left > window.innerWidth / 2
        ? setPlacement('right')
        : setPlacement('left');
      rect.top > window.innerHeight / 2
        ? setVerticlePlacement('top')
        : setVerticlePlacement('bottom');
    }
  }, [ref]);

  return { placement, verticlePlacement };
};

const Scheduler = (
  props: Omit<Context, 'open' | 'setOpen' | 'buttonRef'> & {
    children: React.ReactNode;
  }
) => {
  const {
    day,
    setDay,
    month,
    setMonth,
    week,
    setWeek,
    weekDay,
    setWeekDay,
    children
  } = props;
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  const data = {
    open,
    setOpen,
    day,
    setDay,
    week,
    setWeek,
    weekDay,
    setWeekDay,
    month,
    setMonth,
    buttonRef
  };

  return (
    <pickerContext.Provider value={data}>{children}</pickerContext.Provider>
  );
};

const Button: FC<
  React.HTMLAttributes<HTMLButtonElement> & { iconPlaceholder?: boolean }
> = ({ children, iconPlaceholder, ...props }) => {
  const Component = iconPlaceholder ? FormInputButton : FormInputButton2;

  const [placeholder, setPlaceholder] = useState('');
  const { open, setOpen, buttonRef, day, week, weekDay, month } =
    usePickerContext();

  useEffect(() => {
    if (month && day) {
      setPlaceholder(
        `${dayjs()
          .month(month - 1)
          .format('MMM')} ${day}${getDaySuffix(day)}`
      );
    } else if (week && weekDay) {
      setPlaceholder(
        `${week}${getDaySuffix(week)} ${dayjs().day(weekDay).format('ddd')}`
      );
    } else if (day) {
      setPlaceholder(`The ${day}${getDaySuffix(day)}`);
    }
  }, [day, month, week, weekDay]);

  return (
    <>
      <Component
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setOpen(!open);
          }
        }}
        ref={buttonRef}
        tabIndex={0}
        role="button"
        type="button"
        name="schedule-dropdown"
        className={schedulerStyles.scheduleDropdownButton}
        aria-label="Open schedule dropdown"
        aria-haspopup="true"
        aria-expanded={`${open}`}
        aria-controls="schedule-dropdown"
        style={{
          color: placeholder ? 'var(--m-text)' : 'var(--input-placeholder2)'
        }}
        {...props}
      >
        {iconPlaceholder ? (
          <>
            <Calendar size={'1.125em'} />
            {placeholder}
          </>
        ) : (
          <div>
            <span>{placeholder || 'Repeats on'}</span>
          </div>
        )}
        <ChevronDown size={'1.25em'} />
        {children}
      </Component>
    </>
  );
};

const DayPicker = () => {
  const { setOpen, day, setDay, month } = usePickerContext();
  const [numberOfDays, setNumberOfDays] = useState<number>(
    dayjs()
      .month(month || 0)
      .daysInMonth()
  );
  const [activeDay, setActiveDay] = useState<typeof day>(0);
  const ref = useRef<HTMLDivElement>(null);

  const Day = ({ dayNumber }: { dayNumber: NonNullable<typeof day> }) => (
    <td key={dayNumber}>
      <div
        className={[
          schedulerStyles.pickerItem,
          schedulerStyles.dayPickerItem
        ].join(' ')}
        data-selected={day === dayNumber}
        data-active={activeDay === dayNumber}
        onClick={() => setDay(dayNumber)}
        role="button"
        aria-label={`Select day ${dayNumber ? dayNumber + 1 : ''}`}
        aria-pressed={`${day === dayNumber}`}
        aria-selected={`${day === dayNumber}`}
        tabIndex={-1}
      >
        {dayNumber}
      </div>
    </td>
  );

  useEffect(() => {
    setNumberOfDays(
      dayjs()
        .month(month || 0)
        .daysInMonth()
    );
  }, [month]);

  const Row = ({ number }: { number: number }) => (
    <tr>
      {Array.from({ length: 7 }, (_, i) => (
        <Day
          key={i}
          dayNumber={(i + 1 + 7 * number) as NonNullable<typeof day>}
        />
      ))}
    </tr>
  );

  const PartialRow = () => (
    <tr>
      {Array.from({ length: numberOfDays - 28 }, (_, i) => (
        <Day key={i + 29} dayNumber={(i + 29) as NonNullable<typeof day>} />
      ))}
    </tr>
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.shiftKey || event.altKey || event.ctrlKey) {
      return;
    }
    if (activeDay === undefined) return;

    switch (event.key) {
      case 'ArrowRight':
        setActiveDay(
          activeDay < numberOfDays ? ((activeDay + 1) as typeof activeDay) : 1
        );
        break;
      case 'ArrowLeft':
        setActiveDay(
          activeDay > 1 ? ((activeDay - 1) as typeof activeDay) : numberOfDays
        );
        break;
      case 'ArrowUp':
        if (activeDay <= numberOfDays - 28) {
          setActiveDay((activeDay + 28) as typeof activeDay);
        } else if (activeDay >= numberOfDays - 28 && activeDay <= 7) {
          setActiveDay((activeDay + 21) as typeof activeDay);
        } else {
          setActiveDay(
            activeDay ? ((activeDay - 7) as typeof activeDay) : numberOfDays
          );
        }
        break;
      case 'ArrowDown':
        if (activeDay > 28) {
          setActiveDay((activeDay - 28) as typeof activeDay);
        } else if (activeDay > numberOfDays - 7) {
          setActiveDay((activeDay - 21) as typeof activeDay);
        } else {
          setActiveDay(activeDay ? ((activeDay + 7) as typeof activeDay) : 1);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
      case 'Enter':
        setDay(activeDay);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      className={schedulerStyles.dayPicker}
      ref={ref}
      onBlur={() => {
        setActiveDay(undefined);
      }}
      onMouseEnter={() => setActiveDay(undefined)}
      onKeyDown={(event) => handleKeyDown(event)}
      tabIndex={0}
    >
      <table>
        <tbody>
          <Row number={0} />
          <Row number={1} />
          <Row number={2} />
          <Row number={3} />
          <PartialRow />
        </tbody>
      </table>
    </div>
  );
};

const WeekPicker = () => {
  const {
    week: weekNumber,
    setWeek: setWeekNumber,
    weekDay,
    setWeekDay,
    setOpen
  } = usePickerContext();

  const [activeWeekNumber, setActiveWeekNumber] = useState<typeof weekNumber>();
  const [activeWeekDay, setActiveWeekDay] = useState<typeof weekDay>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const formatWeek = (weekNumber: number) => {
    switch (weekNumber) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      case 4:
        return 'th';
      default:
        return;
    }
  };

  const formatWeekDay = (weekDayNumber: number) => {
    switch (weekDayNumber) {
      case 1:
        return 'Sun';
      case 2:
        return 'Mon';
      case 3:
        return 'Tue';
      case 4:
        return 'Wed';
      case 5:
        return 'Thu';
      case 6:
        return 'Fri';
      case 7:
        return 'Sat';
      default:
        return '';
    }
  };

  const WeekNumber = ({ week }: { week: NonNullable<typeof weekNumber> }) => (
    <li>
      <div
        className={[
          schedulerStyles.pickerItem,
          schedulerStyles.weekPickerItem
        ].join(' ')}
        data-selected={week === weekNumber}
        data-active={week === activeWeekNumber}
        onClick={() => {
          setWeekNumber(week);
        }}
        role="button"
        aria-label={`Select week ${week}`}
        aria-pressed={`${week === weekNumber}`}
        aria-selected={`${week === weekNumber}`}
        tabIndex={-1}
      >
        {week <= 4 && `${week}`}
        {week > 4 && 'Last'}
        <span
          style={{
            fontSize: '.8em'
          }}
        >
          {formatWeek(week)}
        </span>
      </div>
    </li>
  );

  const WeekDay = ({
    dayNumber
  }: {
    dayNumber: NonNullable<typeof weekDay>;
  }) => (
    <li>
      <div
        className={[
          schedulerStyles.pickerItem,
          schedulerStyles.weekDayPickerItem
        ].join(' ')}
        data-selected={weekDay === dayNumber}
        data-active={activeWeekDay === dayNumber}
        onClick={() => setWeekDay(dayNumber)}
        role="button"
        aria-label={`Select day ${dayNumber}`}
        aria-pressed={`${weekDay === dayNumber}`}
        aria-selected={`${weekDay === dayNumber}`}
        tabIndex={-1}
      >
        {formatWeekDay(dayNumber)}
      </div>
    </li>
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
        if (activeWeekNumber) {
          setActiveWeekNumber(
            activeWeekNumber < 5
              ? ((activeWeekNumber + 1) as typeof activeWeekNumber)
              : 1
          );
        } else if (activeWeekDay) {
          setActiveWeekDay(
            activeWeekDay < 7
              ? ((activeWeekDay + 1) as typeof activeWeekDay)
              : 1
          );
        } else {
          setActiveWeekNumber(1);
        }
        break;
      case 'ArrowLeft':
        if (activeWeekNumber) {
          setActiveWeekNumber(
            activeWeekNumber > 1
              ? ((activeWeekNumber - 1) as typeof activeWeekNumber)
              : 5
          );
        } else if (activeWeekDay) {
          setActiveWeekDay(
            activeWeekDay > 1
              ? ((activeWeekDay - 1) as typeof activeWeekDay)
              : 7
          );
        } else {
        }
        break;
      case 'ArrowUp':
        if (activeWeekDay) {
          setActiveWeekNumber(
            Math.min(5, activeWeekDay) as typeof activeWeekNumber
          );
          setActiveWeekDay(undefined);
        }
        break;
      case 'ArrowDown':
        if (activeWeekNumber) {
          setActiveWeekDay(activeWeekNumber);
          setActiveWeekNumber(undefined);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
      case 'Enter':
        if (activeWeekNumber) {
          setWeekNumber(activeWeekNumber);
        }
        if (activeWeekDay) {
          setWeekDay(activeWeekDay);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={schedulerStyles.weekPickerContainer}
      ref={ref}
      onBlur={() => {
        setActiveWeekDay(undefined);
        setActiveWeekNumber(undefined);
      }}
      onMouseEnter={() => {
        setActiveWeekDay(undefined);
        setActiveWeekNumber(undefined);
      }}
      onKeyDown={(event) => handleKeyDown(event)}
      tabIndex={0}
    >
      <ul
        className={schedulerStyles.weekPicker}
        role="listbox"
        aria-label="Select week number"
        aria-activedescendant={`week-${activeWeekNumber}`}
        aria-orientation="horizontal"
        aria-multiselectable="false"
        aria-disabled="false"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <WeekNumber
            key={i + 1}
            week={(i + 1) as NonNullable<typeof weekNumber>}
          />
        ))}
      </ul>
      <hr
        style={{
          width: '100%'
        }}
      />
      <ul
        className={schedulerStyles.weekDayPicker}
        role="listbox"
        aria-label="Select week day"
        aria-activedescendant={`week-day-${activeWeekDay}`}
        aria-orientation="horizontal"
        aria-multiselectable="false"
        aria-disabled="false"
      >
        {Array.from({ length: 7 }, (_, i) => (
          <WeekDay
            key={i + 1}
            dayNumber={(i + 1) as NonNullable<typeof weekDay>}
          />
        ))}
      </ul>
    </div>
  );
};

const DayWeekPicker = () => {
  const {
    open,
    setOpen,
    buttonRef,
    day,
    week,
    setWeek,
    weekDay,
    setWeekDay,
    setDay
  } = usePickerContext();

  const ref = useRef<HTMLDivElement>(null);
  const pillBackgroundColor = useSchemeVar('--input-background');

  useEffect(() => {
    open ? ref.current?.focus() : ref.current?.blur();
  }, [open]);

  useClickClose({
    refs: [ref, buttonRef],
    visible: open,
    setVisible: setOpen
  });

  // Clear other inputs different
  // mode's inputs are entered
  useEffect(() => {
    if (day) {
      setWeek(undefined);
      setWeekDay(undefined);
      setOpen(false);
    }
  }, [day]);

  // Clear other inputs different mode's
  // inputs are entered
  useEffect(() => {
    if (week || weekDay) setDay(undefined);
    if (week && weekDay) setOpen(false);
  }, [weekDay, week]);

  const { placement, verticlePlacement } = useResponsiveDropdownPlacement({
    ref
  });

  return (
    <DropdownDiv
      placement={placement}
      verticlePlacement={verticlePlacement}
      visible={open}
      className={schedulerStyles.scheduleDropdown}
    >
      <Tab.Group as="div" ref={ref} defaultIndex={week && weekDay ? 1 : 0}>
        {({ selectedIndex }) => (
          <>
            <TabNavList
              size="sm"
              selectedIndex={selectedIndex}
              labels={['Day', 'Week']}
              theme={{
                pillBackgroundColor: pillBackgroundColor || 'black',
                tabColor: 'inherit',
                tabBackgroundColor: 'transparent'
              }}
            />
            <Tab.Panels>
              <Tab.Panel>
                <DayPicker />
              </Tab.Panel>
              <Tab.Panel>
                <WeekPicker />
              </Tab.Panel>
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
    </DropdownDiv>
  );
};

const MonthPicker = () => {
  const { month, setMonth, setOpen } = usePickerContext();

  const [activeMonth, setActiveMonth] = useState<typeof month>();
  const ref = useRef<HTMLDivElement>(null);

  const Month = ({ monthNumber }: { monthNumber: typeof month }) => (
    <li>
      <div
        className={schedulerStyles.pickerItem}
        data-selected={month === monthNumber}
        data-active={activeMonth === monthNumber}
        onClick={() => setMonth(monthNumber)}
        role="button"
        aria-label={`Select month ${monthNumber}`}
        aria-pressed={`${month === monthNumber}`}
        aria-selected={`${month === monthNumber}`}
        tabIndex={-1}
      >
        {monthNumber &&
          `${dayjs()
            .month(monthNumber - 1)
            .format('MMM')}`}
      </div>
    </li>
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!activeMonth) return;

    const key = event.key;
    const actions = {
      ArrowRight: () => {
        setActiveMonth(
          activeMonth < 12 ? ((activeMonth + 1) as typeof month) : 1
        );
      },
      ArrowLeft: () => {
        setActiveMonth(
          activeMonth > 1 ? ((activeMonth - 1) as typeof month) : 12
        );
      },
      ArrowUp: () => {
        setActiveMonth(
          activeMonth > 6 ? ((activeMonth - 6) as typeof month) : activeMonth
        );
      },
      ArrowDown: () => {
        setActiveMonth(
          activeMonth < 6 ? ((activeMonth + 6) as typeof month) : activeMonth
        );
      },
      Enter: () => {
        setMonth(activeMonth);
      },
      Tab: () => {
        setActiveMonth(undefined);
      },
      Escape: () => {
        setOpen(false);
      },
      default: () => {}
    };
    const action = actions[key as keyof typeof actions] || actions['default'];
    action();
  };

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      className={schedulerStyles.monthPicker2Container}
      ref={ref}
      onBlur={() => {
        setActiveMonth(undefined);
      }}
      onMouseEnter={() => {
        setActiveMonth(undefined);
      }}
      onKeyDown={(event) => handleKeyDown(event)}
      tabIndex={0}
    >
      <ul
        className={schedulerStyles.monthPicker2}
        role="listbox"
        aria-label="Select month number"
        aria-activedescendant={`month-${setActiveMonth}`}
        aria-orientation="horizontal"
        aria-multiselectable="false"
        aria-disabled="false"
      >
        <div>
          {Array.from({ length: 6 }, (_, i) => (
            <Month key={i + 1} monthNumber={(i + 1) as typeof month} />
          ))}
        </div>
        <div>
          {Array.from({ length: 6 }, (_, i) => (
            <Month key={i + 7} monthNumber={(i + 7) as typeof month} />
          ))}
        </div>
      </ul>
    </div>
  );
};

const MonthDayPicker = () => {
  const { open, setOpen, buttonRef, month, day } = usePickerContext();

  const ref = useRef<HTMLDivElement>(null);

  useClickClose({
    refs: [ref, buttonRef],
    visible: open,
    setVisible: setOpen
  });

  useEffect(() => {
    open ? ref.current?.focus() : ref.current?.blur();
  }, [open]);

  useEffect(() => {
    if (month && day) {
      setOpen(false);
    }
  }, [month, day]);

  const { placement, verticlePlacement } = useResponsiveDropdownPlacement({
    ref
  });

  return (
    <DropdownDiv
      placement={placement}
      verticlePlacement={verticlePlacement}
      visible={open}
      className={schedulerStyles.scheduleDropdown}
      style={{ marginTop: '.5em' }}
    >
      <div
        className={dropdownStyles.monthDayPickerContainer}
        ref={ref}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === 'Escape') {
            setOpen(false);
          }
        }}
      >
        <MonthPicker />
        <hr style={{ opacity: '.7', margin: '.5em 0', width: '100%' }} />
        <DayPicker />
      </div>
    </DropdownDiv>
  );
};

type defaultValue = Pick<Bill, 'day' | 'month' | 'week'> & {
  weekDay: Bill['week_day'];
};

interface BSP {
  billPeriod: Bill['period'];
  defaultValue?: defaultValue;
  setHasSchedule?: React.Dispatch<React.SetStateAction<boolean>>;
  error?: FieldError;
  register: UseFormRegister<any>;
  iconPlaceholder?: boolean;
}

export const BillScheduler = (props: BSP) => {
  const { billPeriod, error, defaultValue, register } = props;

  const [day, setDay] = useState(defaultValue?.day);
  const [month, setMonth] = useState(defaultValue?.month);
  const [week, setWeek] = useState(defaultValue?.week);
  const [weekDay, setWeekDay] = useState(defaultValue?.weekDay);

  useEffect(() => {
    if (day || month || (week && weekDay))
      props.setHasSchedule && props.setHasSchedule(true);
    else props.setHasSchedule && props.setHasSchedule(false);
  }, [day, month, week, weekDay]);

  return (
    <>
      {month && <input type="hidden" value={month} {...register('month')} />}
      {day && <input type="hidden" value={day} {...register('day')} />}
      {weekDay && (
        <input type="hidden" value={weekDay} {...register('week_day')} />
      )}
      {week && <input type="hidden" value={week} {...register('week')} />}
      <Scheduler
        day={day}
        setDay={setDay}
        month={month}
        setMonth={setMonth}
        week={week}
        setWeek={setWeek}
        weekDay={weekDay}
        setWeekDay={setWeekDay}
      >
        <div className={schedulerStyles.schedulerContainer}>
          <Scheduler.Button iconPlaceholder={props.iconPlaceholder}>
            {error && <FormErrorTip error={{ type: 'required' }} />}
          </Scheduler.Button>
          <>
            {billPeriod === 'month' ? (
              <Scheduler.DayWeekPicker />
            ) : (
              <Scheduler.MonthDayPicker />
            )}
          </>
        </div>
      </Scheduler>
    </>
  );
};

Scheduler.Button = Button;
Scheduler.DayWeekPicker = DayWeekPicker;
Scheduler.MonthDayPicker = MonthDayPicker;

export default Scheduler;
