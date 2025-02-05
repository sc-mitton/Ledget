import {
  useState,
  useRef,
  useEffect,
  HTMLProps,
  createContext,
  useContext,
} from 'react';

import dayjs, { Dayjs } from 'dayjs';
import {
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
} from '@geist-ui/icons';

import styles from './date-picker.module.scss';
import { DropdownDiv } from '../../animations/dropdowndiv/dropdowndiv';
import { HalfArrow } from '@ledget/media';
import { TextInputWrapper } from '../text/text';
import { Tooltip } from '../../pieces/tool-tip/Tooltip';
import {
  IconButtonBlue,
  IconButtonHalfBlue,
} from '../../buttons/styled-buttons';
import { CircleIconButton } from '../../buttons/specialty-buttons';
import { useCloseDropdown } from '../../utils/hooks';
import { useLoaded } from '@ledget/helpers';
import type {
  DatePickerProps,
  UnenrichedDatePickerProps,
  DatePickerContextProps,
  TPicker,
  TDatePickerContext,
  CalendarCellProps,
  YearsMonthsProps,
  DaysProps,
  TPlacement,
} from './types';
import { checkDisabled } from './helpers';

// Context
const datePickerContext = createContext<
  TDatePickerContext<TPicker> | undefined
>(undefined);

const DatePickerContextProvider = <TP extends TPicker>({
  children,
  pickerType,
  defaultValue,
  ...rest
}: DatePickerContextProps<TP> & { children: React.ReactNode }) => {
  const [selectedValue, setSelectedValue] =
    useState<typeof defaultValue>(defaultValue);
  const [focusedInputIndex, setFocusedInputIndex] =
    useState<TDatePickerContext<TP>['focusedInputIndex']>();
  const [inputTouchCount, setInputTouchCount] = useState<
    TDatePickerContext<TP>['inputTouchCount']
  >(pickerType === 'range' ? [0, 0] : 0);

  return (
    <datePickerContext.Provider
      value={
        {
          selectedValue,
          setSelectedValue,
          focusedInputIndex,
          setFocusedInputIndex,
          pickerType,
          inputTouchCount,
          setInputTouchCount,
          ...rest,
        } as any
      }
    >
      {children}
    </datePickerContext.Provider>
  );
};

const useDatePickerContext = () => {
  const context = useContext(datePickerContext);
  if (!context)
    throw new Error(
      'useDatePickerContext must be used within a DatePickerContextProvider'
    );
  return context;
};

// Components
const PickerCell: React.FC<
  HTMLProps<HTMLTableCellElement> & CalendarCellProps
> = (props) => {
  const {
    isDisabled,
    isActiveWindowEnd,
    isActiveWindowStart,
    isActive,
    isToday,
    isOverflow,
    isSelected,
    isWindowEnd,
    isWindowStart,
    children,
    extraPadded,
    ...rest
  } = props;
  const { disabledStyle } = useDatePickerContext();

  return (
    <div
      {...rest}
      className={styles.cell}
      data-overflow={Boolean(isOverflow)}
      data-disabled={Boolean(isDisabled)}
      data-active={Boolean(isActive)}
      data-selected={Boolean(isSelected)}
      data-today={Boolean(isToday)}
      data-active-window-start={Boolean(isActiveWindowStart)}
      data-active-window-end={Boolean(isActiveWindowEnd)}
      data-window-start={Boolean(isWindowStart)}
      data-window-end={Boolean(isWindowEnd)}
      data-extra-padded={Boolean(extraPadded)}
      data-disabled-style={disabledStyle}
    >
      {children}
    </div>
  );
};

const EmptyPickerCell = ({ period }: { period: 'day' | 'year' | 'month' }) => (
  <div
    className={styles.cell}
    data-empty={true}
    data-extra-padded={period !== 'day'}
  >
    {period === 'day' ? 1 : period === 'month' ? 'Jan' : '2020'}
  </div>
);

const Years = ({ windowCenter, onSelect }: YearsMonthsProps) => {
  const {
    pickerType,
    selectedValue,
    focusedInputIndex,
    inputTouchCount,
    disabled,
    hidden,
    period,
  } = useDatePickerContext();

  const [active, setActive] = useState<Dayjs>();

  return (
    <div className={styles.yearCalendar}>
      {Array.from({ length: 12 }).map((_, i) => {
        const djs =
          i === 0
            ? windowCenter
                .year(Math.round(windowCenter.year() / 10) * 10)
                .subtract(1, 'year')
            : i === 11
            ? windowCenter.year(Math.round(windowCenter.year() / 10) * 10 + 10)
            : windowCenter
                .year(Math.round(windowCenter.year() / 10) * 10)
                .add(i, 'year');

        const isActive = active
          ? pickerType === 'range'
            ? focusedInputIndex === 0
              ? djs.isAfter(active) && djs.isBefore(selectedValue?.[1], 'year')
              : djs.isBefore(active) && djs.isAfter(selectedValue?.[0], 'year')
            : false
          : false;
        const isSelected =
          pickerType === 'range'
            ? selectedValue?.every((v) => v)
              ? djs.isAfter(selectedValue?.[0], 'year') &&
                djs.isBefore(selectedValue?.[1], 'year')
              : false
            : false;
        const unSelectable =
          pickerType === 'range'
            ? focusedInputIndex === 0
              ? selectedValue?.[1] && djs.isAfter(selectedValue?.[1], 'year')
              : selectedValue?.[0] && djs.isBefore(selectedValue?.[0], 'year')
            : false;
        const ignoreUnSelectable =
          pickerType === 'range' &&
          (!selectedValue?.[focusedInputIndex || 0] ||
            inputTouchCount[focusedInputIndex || 0] < 1);
        const isDisabled = checkDisabled(djs, period, disabled);
        const isHidden = checkDisabled(djs, period, hidden);

        return isHidden ? (
          <EmptyPickerCell period="year" />
        ) : (
          <PickerCell
            onClick={() => {
              onSelect(djs);
            }}
            extraPadded={true}
            onMouseEnter={() => setActive(djs)}
            isDisabled={(unSelectable || isDisabled) && !ignoreUnSelectable}
            isActive={isActive}
            isSelected={isSelected}
            isActiveWindowEnd={
              pickerType === 'range' &&
              focusedInputIndex === 1 &&
              djs.isSame(active, 'year') &&
              djs.isAfter(selectedValue?.[0], 'year')
            }
            isActiveWindowStart={
              pickerType === 'range' &&
              focusedInputIndex === 0 &&
              djs.isSame(active, 'year') &&
              djs.isBefore(selectedValue?.[1], 'year')
            }
            isWindowStart={
              pickerType === 'range'
                ? selectedValue?.[0] && djs.isSame(selectedValue[0], 'year')
                : djs.isSame(selectedValue, 'year')
            }
            isWindowEnd={
              pickerType === 'range'
                ? selectedValue?.[1] && djs.isSame(selectedValue[1], 'year')
                : djs.isSame(selectedValue, 'year')
            }
          >
            {djs.format('YYYY')}
          </PickerCell>
        );
      })}
    </div>
  );
};

const Months = ({ windowCenter, onSelect }: YearsMonthsProps) => {
  const [activeMonth, setActiveMonth] = useState<Dayjs>();
  const {
    selectedValue,
    pickerType,
    focusedInputIndex,
    disabled,
    hidden,
    inputTouchCount,
    period,
  } = useDatePickerContext();

  return (
    <div
      className={styles.monthCalendar}
      onMouseLeave={() => setActiveMonth(undefined)}
    >
      <>
        {Array.from({ length: 12 }).map((_, i) => {
          const djs = windowCenter.month(i);
          const isActive =
            pickerType === 'range' && activeMonth
              ? focusedInputIndex === 0
                ? djs.isAfter(activeMonth, 'month') &&
                  djs.isBefore(selectedValue?.[1], 'month')
                : djs.isBefore(activeMonth, 'month') &&
                  djs.isAfter(selectedValue?.[0], 'month')
              : false;
          const isSelected =
            pickerType === 'range'
              ? selectedValue?.every((v) => v)
                ? djs.isAfter(selectedValue?.[0], 'month') &&
                  djs.isBefore(selectedValue?.[1], 'month')
                : false
              : false;
          const unSelectable =
            pickerType === 'range'
              ? focusedInputIndex === 0
                ? selectedValue?.[1] && djs.isAfter(selectedValue?.[1], 'month')
                : selectedValue?.[0] &&
                  djs.isBefore(selectedValue?.[0], 'month')
              : false;
          const ignoreUnSelectable =
            pickerType === 'range' &&
            (!selectedValue?.[focusedInputIndex || 0] ||
              inputTouchCount[focusedInputIndex || 0] < 1);
          const isDisabled = checkDisabled(djs, period, disabled);
          const isHidden = checkDisabled(djs, period, hidden);

          return isHidden ? (
            <EmptyPickerCell period="month" />
          ) : (
            <PickerCell
              onMouseEnter={() => setActiveMonth(djs)}
              isActive={isActive}
              isDisabled={(unSelectable || isDisabled) && !ignoreUnSelectable}
              onClick={() => {
                onSelect(djs);
              }}
              isSelected={isSelected}
              isActiveWindowEnd={
                pickerType === 'range' &&
                focusedInputIndex === 1 &&
                djs.isSame(activeMonth, 'month') &&
                djs.isAfter(selectedValue?.[0], 'day')
              }
              isActiveWindowStart={
                pickerType === 'range' &&
                focusedInputIndex === 0 &&
                djs.isSame(activeMonth, 'month') &&
                djs.isBefore(selectedValue?.[1], 'day')
              }
              isWindowStart={
                pickerType === 'range'
                  ? djs.isSame(selectedValue?.[0], 'month')
                  : djs.isSame(selectedValue, 'month')
              }
              isWindowEnd={
                pickerType === 'range'
                  ? djs.isSame(selectedValue?.[1], 'month')
                  : djs.isSame(selectedValue, 'month')
              }
              extraPadded={true}
            >
              {djs.month(i).format('MMM')}
            </PickerCell>
          );
        })}
      </>
    </div>
  );
};

const Days = ({ month, year, activeDay, setActiveDay }: DaysProps) => {
  const {
    selectedValue,
    setSelectedValue,
    pickerType,
    disabled,
    hidden,
    inputTouchCount,
    focusedInputIndex,
    period,
  } = useDatePickerContext();
  const [firstDay, setFirstDay] = useState<Dayjs>();
  const [days, setDays] = useState<number[]>();

  const handleClick = (day: Dayjs, reset = false) => {
    pickerType === 'range'
      ? focusedInputIndex === 0
        ? reset
          ? setSelectedValue([day, undefined])
          : setSelectedValue([day, selectedValue?.[1]])
        : reset
        ? setSelectedValue([undefined, day])
        : setSelectedValue([selectedValue?.[0], day])
      : setSelectedValue(day);
  };

  const unsetActiveDay = () => {
    setActiveDay(undefined);
  };

  useEffect(() => {
    setFirstDay(dayjs().month(month).year(year).date(1));
  }, [month, year]);

  useEffect(() => {
    if (!firstDay) return;

    setDays(
      Array.from({ length: firstDay.day() })
        .map((_, i) => i)
        .concat(
          Array.from({ length: firstDay.daysInMonth() })
            .map((_, i) => i)
            .concat(
              Array.from({ length: 7 - firstDay.add(1, 'month').date(1).day() })
                .map((_, i) => i)
                .concat(
                  Array.from({
                    length:
                      firstDay.daysInMonth() + firstDay.day() >= 35 ? 0 : 7,
                  }).map(
                    (_, i) => i + 7 - firstDay.add(1, 'month').date(1).day()
                  )
                )
            )
        )
    );
  }, [firstDay]);

  return (
    <div className={styles.dayCalendar} onMouseLeave={unsetActiveDay}>
      <div onMouseEnter={unsetActiveDay}>Su</div>
      <div onMouseEnter={unsetActiveDay}>Mo</div>
      <div onMouseEnter={unsetActiveDay}>Tu</div>
      <div onMouseEnter={unsetActiveDay}>We</div>
      <div onMouseEnter={unsetActiveDay}>Th</div>
      <div onMouseEnter={unsetActiveDay}>Fr</div>
      <div onMouseEnter={unsetActiveDay}>Sa</div>
      {days?.map((date, i) => {
        const day =
          date === i
            ? dayjs()
                .month(month)
                .year(year)
                .startOf('month')
                .subtract(
                  dayjs().month(month).year(year).startOf('month').day() - i,
                  'day'
                )
            : i - date > 10
            ? dayjs()
                .month(month)
                .year(year)
                .date(date + 1)
                .add(1, 'month')
            : dayjs()
                .month(month)
                .year(year)
                .date(date + 1);

        const isOverflow = day.month() !== month;
        // const ignoreUnSelectable =
        //   pickerType === 'range' &&
        //   (!selectedValue?.[focusedInputIndex || 0] ||
        //     inputTouchCount[focusedInputIndex || 0] < 1);
        const unSelectable =
          pickerType === 'range'
            ? focusedInputIndex === 0
              ? selectedValue?.[1] && day.isAfter(selectedValue?.[1], 'day')
              : selectedValue?.[0] && day.isBefore(selectedValue?.[0], 'day')
            : false;
        const isDisabled = checkDisabled(day, period, disabled);
        const isHidden = checkDisabled(day, period, hidden);
        const isActive =
          activeDay && !isOverflow
            ? pickerType === 'range'
              ? focusedInputIndex === 0
                ? day.isAfter(activeDay) &&
                  day.isBefore(selectedValue?.[1], 'day')
                : day.isBefore(activeDay) &&
                  day.isAfter(selectedValue?.[0], 'day')
              : false
            : false;
        const isSelected =
          pickerType === 'range' && !isOverflow
            ? selectedValue?.every((v) => v)
              ? day.isAfter(selectedValue?.[0], 'day') &&
                day.isBefore(selectedValue?.[1], 'day')
              : false
            : false;
        const isActiveWindowEnd =
          pickerType === 'range' &&
          focusedInputIndex === 1 &&
          day.isSame(activeDay, 'day') &&
          day.isAfter(selectedValue?.[0], 'day');
        const isActiveWindowStart =
          pickerType === 'range' &&
          focusedInputIndex === 0 &&
          day.isSame(activeDay, 'day') &&
          day.isBefore(selectedValue?.[1], 'day');
        const isWindowStart =
          pickerType === 'range'
            ? selectedValue?.[0] && day.isSame(selectedValue[0], 'day')
            : selectedValue && day.isSame(selectedValue, 'day');
        const isWindowEnd =
          pickerType === 'range'
            ? selectedValue?.[1] && day.isSame(selectedValue[1], 'day')
            : selectedValue && day.isSame(selectedValue, 'day');

        return isHidden ? (
          <EmptyPickerCell period="day" />
        ) : (
          <PickerCell
            onClick={() => {
              isOverflow
                ? handleClick(day, true)
                : !isDisabled &&
                  handleClick(
                    day,
                    isSelected ||
                      (!isActive && !isActiveWindowEnd && !isActiveWindowStart)
                  );
            }}
            onMouseEnter={() =>
              !isOverflow
                ? selectedValue && setActiveDay(day)
                : setActiveDay(undefined)
            }
            isDisabled={unSelectable || isDisabled}
            isActive={isActive}
            isActiveWindowEnd={!isOverflow && isActiveWindowEnd}
            isActiveWindowStart={!isOverflow && isActiveWindowStart}
            isToday={!isOverflow && day.isSame(dayjs(), 'day')}
            isSelected={!isOverflow && isSelected}
            isWindowStart={!isOverflow && isWindowStart}
            isWindowEnd={!isOverflow && isWindowEnd}
            isOverflow={isOverflow}
          >
            <Tooltip msg={day.format('YYYY-M-D')}>{day.date()}</Tooltip>
          </PickerCell>
        );
      })}
    </div>
  );
};

const DayMonthYearPicker = () => {
  const { pickerType, selectedValue, focusedInputIndex, period } =
    useDatePickerContext();

  const [view, setView] = useState<'day' | 'month' | 'year'>(period);
  const [windowCenter, setWindowCenter] = useState<Dayjs>();
  const [activeCell, setActiveCell] = useState<Dayjs>();

  // Update the picker range / date
  useEffect(() => {
    const invertFocusIndex = focusedInputIndex === 0 ? 1 : 0;
    pickerType === 'range'
      ? selectedValue
        ? setWindowCenter(
            selectedValue[focusedInputIndex || 0] ||
              selectedValue[invertFocusIndex]
          )
        : setWindowCenter(dayjs())
      : selectedValue
      ? setWindowCenter(selectedValue)
      : setWindowCenter(dayjs());
  }, [selectedValue, pickerType, focusedInputIndex]);

  const handleSeek = (e: any, direction: 1 | -1, speed: 'normal' | 'fast') => {
    e.preventDefault();

    const seekPeriod =
      view === 'day' ? 'month' : view === 'month' ? 'year' : 'year';
    const amount =
      speed === 'normal'
        ? view === 'year'
          ? 10
          : 1
        : view === 'day'
        ? 12
        : 10;

    setWindowCenter(windowCenter?.add(direction * amount, seekPeriod));
  };

  return (
    <div className={styles.ledgetDatePickerCalendar}>
      {/* Header */}
      <div>
        <div>
          <IconButtonHalfBlue onClick={(e) => handleSeek(e, -1, 'fast')}>
            <ChevronsLeft size="1.25em" strokeWidth={2} />
          </IconButtonHalfBlue>
          {view !== 'year' && (
            <IconButtonHalfBlue onClick={(e) => handleSeek(e, -1, 'normal')}>
              <ChevronLeft size="1.25em" strokeWidth={2} />
            </IconButtonHalfBlue>
          )}
        </div>
        {focusedInputIndex === 0 &&
          pickerType === 'range' &&
          view === 'day' && (
            <div>
              <button onClick={() => setView('month')}>
                {windowCenter?.subtract(1, 'month').format('MMM')}
              </button>
              <button onClick={() => setView('year')}>
                {windowCenter?.subtract(1, 'month').format('YYYY')}
              </button>
            </div>
          )}
        <div>
          {view === 'day' && (
            <button onClick={() => setView('month')}>
              {windowCenter?.format('MMM')}
            </button>
          )}
          {view !== 'year' && (
            <button onClick={() => setView('year')}>
              {windowCenter?.format('YYYY')}
            </button>
          )}
          {view === 'year' && windowCenter && (
            <span>
              {dayjs()
                .year(Math.round(windowCenter.year() / 10) * 10)
                .format('YYYY')}
              {' - '}
              {dayjs()
                .year(Math.round(windowCenter.year() / 10) * 10 + 9)
                .format('YYYY')}
            </span>
          )}
        </div>
        {focusedInputIndex === 1 &&
          pickerType === 'range' &&
          view === 'day' && (
            <div>
              <button onClick={() => setView('month')}>
                {windowCenter?.add(1, 'month').format('MMM')}
              </button>
              <button onClick={() => setView('year')}>
                {windowCenter?.add(1, 'month').format('YYYY')}
              </button>
            </div>
          )}
        <div>
          {view !== 'year' && (
            <IconButtonHalfBlue onClick={(e) => handleSeek(e, 1, 'normal')}>
              <ChevronRight size="1.25em" strokeWidth={2} />
            </IconButtonHalfBlue>
          )}
          <IconButtonHalfBlue onClick={(e) => handleSeek(e, 1, 'fast')}>
            <ChevronsRight size="1.25em" strokeWidth={2} />
          </IconButtonHalfBlue>
        </div>
      </div>
      {/* Items Pick */}
      <div>
        {/* Lowest level of selection, the day */}
        {view === 'day' && pickerType === 'range' && windowCenter && (
          <>
            <Days
              month={
                focusedInputIndex === 0
                  ? windowCenter.subtract(1, 'month').month()
                  : windowCenter.month()
              }
              year={
                focusedInputIndex === 0
                  ? windowCenter.subtract(1, 'month').year()
                  : windowCenter.year()
              }
              activeDay={activeCell}
              setActiveDay={setActiveCell}
            />
            <Days
              month={
                focusedInputIndex === 1
                  ? windowCenter.add(1, 'month').month()
                  : windowCenter.month()
              }
              year={
                focusedInputIndex === 1
                  ? windowCenter.add(1, 'month').year()
                  : windowCenter.year()
              }
              activeDay={activeCell}
              setActiveDay={setActiveCell}
            />
          </>
        )}
        {view === 'day' && windowCenter && pickerType !== 'range' && (
          <Days
            month={windowCenter.month()}
            year={windowCenter.year()}
            activeDay={activeCell}
            setActiveDay={setActiveCell}
          />
        )}

        {/* If the view is month, then have a component for the months of the year
          which takes as props a callback to set the month for the calendar. After selection,
          the view will change to day */}
        {view === 'month' && (
          <Months
            windowCenter={windowCenter || dayjs()}
            onSelect={(month) => {
              setWindowCenter(month);
              !['month', 'year'].includes(period) && setView('day');
            }}
          />
        )}

        {/* If the view is year, then have a component for the years
          which takes as props a callback to set the year for the calendar. After selection,
          the view will change to month */}

        {view === 'year' && (
          <Years
            windowCenter={windowCenter || dayjs()}
            onSelect={(month) => {
              setWindowCenter(month);
              period !== 'year' && setView('month');
            }}
          />
        )}
      </div>
      {/* Today Window Seek */}
      <div>
        <IconButtonBlue
          type="button"
          onClick={() => {
            setWindowCenter(dayjs());
          }}
          aria-label="Go to today"
        >
          Today
        </IconButtonBlue>
      </div>
    </div>
  );
};

function UnenrichedDatePicker(props: UnenrichedDatePickerProps<TPicker>) {
  const {
    focusedInputIndex,
    setFocusedInputIndex,
    inputTouchCount,
    setInputTouchCount,
    pickerType,
    selectedValue,
    setSelectedValue,
  } = useDatePickerContext();

  const [showPicker, setShowPicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<TPlacement>(
    props.placement || 'left'
  );
  const [verticlePlacement, setVerticlePlacement] = useState<'top' | 'bottom'>(
    props.verticlePlacement || 'bottom'
  );
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const loaded = useLoaded(200);

  useCloseDropdown(
    props.dropdownVisible !== undefined &&
      props.setDropdownVisible !== undefined
      ? {
          refs: [dropdownRef],
          visible: props.dropdownVisible,
          setVisible: props.setDropdownVisible,
        }
      : {
          refs: [dropdownRef, inputContainerRef],
          visible: showPicker,
          setVisible: setShowPicker,
        }
  );

  // Once the value has been selected, if closeOnSelect is true, close the picker
  useEffect(() => {
    if (props.closeOnSelect) {
      pickerType === 'range'
        ? selectedValue?.every((v) => v) && setShowPicker(false)
        : selectedValue && setShowPicker(false);
    }
  }, [selectedValue]);

  useEffect(() => {
    if (!loaded) return;

    if (pickerType === 'range') {
      if (!selectedValue?.[0] && !selectedValue?.[1]) {
        setInputTouchCount([0, 0]);
        if (startInputRef.current) {
          startInputRef.current.value = '';
        }
        if (endInputRef.current) {
          endInputRef.current.value = '';
        }
      } else if (selectedValue?.[0]) {
        setInputTouchCount([inputTouchCount[0] + 1, inputTouchCount[1]]);
        setFocusedInputIndex(1);
        endInputRef.current?.focus();
      } else if (selectedValue?.[1]) {
        setInputTouchCount([inputTouchCount[0], inputTouchCount[1] + 1]);
        setFocusedInputIndex(0);
        startInputRef.current?.focus();
      }
    } else {
      setShowPicker(false);
      setFocusedInputIndex(undefined);
      startInputRef.current?.blur();
    }
  }, [selectedValue]);

  // Call the onchange callback as the selected value changes
  useEffect(() => {
    if (props.onChange) {
      if (pickerType === 'range') {
        if (selectedValue?.every((v) => v !== undefined) || !selectedValue) {
          props.onChange(selectedValue as any);
        }
      } else if (pickerType === 'date') {
        props.onChange(selectedValue as any);
      }
    }
  }, [selectedValue]);

  // Clear the focused input index when the picker is closed
  useEffect(() => {
    if (!showPicker) {
      setFocusedInputIndex(undefined);
      if (pickerType === 'range') {
        setInputTouchCount([0, 0]);
      } else {
        setInputTouchCount(0);
      }
    }
  }, [showPicker]);

  // When the input is focused, show the picker
  useEffect(() => {
    focusedInputIndex !== undefined && setShowPicker(true);
  }, [focusedInputIndex]);

  // If the left side of the dropdown div is on the right
  // side of the screen, put it on the left, otherwise put it on the right
  useEffect(() => {
    if (props.placement) {
      setPlacement(props.placement);
      return;
    }

    if (inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect();
      rect.left > window.innerWidth / 2
        ? setPlacement('right')
        : setPlacement('left');
      rect.top > window.innerHeight / 2
        ? setVerticlePlacement('top')
        : setVerticlePlacement('bottom');
    }
  }, [inputContainerRef, showPicker, props.placement]);

  const handleBlur = (inputIndex: number) => {
    if (showPicker) {
      pickerType === 'range' && inputIndex === 0
        ? setInputTouchCount([inputTouchCount[0] + 1, inputTouchCount[1]])
        : pickerType === 'range' &&
          setInputTouchCount([inputTouchCount[0], inputTouchCount[1] + 1]);
    } else {
      if (pickerType === 'range') {
        !selectedValue?.[0] && setSelectedValue(undefined);
        !selectedValue?.[1] && setSelectedValue(undefined);
      }
    }
  };

  return (
    <div
      className={styles.ledgetDatePickerContainer}
      data-filled={
        pickerType === 'range'
          ? Boolean(selectedValue?.length)
          : Boolean(selectedValue)
          ? 1
          : 0
      }
    >
      {!props.hideInputElement && (
        <TextInputWrapper
          focused={showPicker}
          className={styles.ledgetDatePicker}
          data-pickertype={pickerType}
          data-focused={
            focusedInputIndex !== undefined ? `${focusedInputIndex}` : ''
          }
          data-filled={
            pickerType === 'range'
              ? selectedValue?.some((v) => v)
              : Boolean(selectedValue)
          }
          slim={true}
          ref={inputContainerRef}
        >
          <input
            ref={startInputRef}
            autoComplete="off"
            type="text"
            onFocus={() => {
              setFocusedInputIndex(0);
            }}
            onBlur={() => {
              handleBlur(0);
            }}
            name={
              props.name
                ? `${props.name}${pickerType === 'range' ? '[0]' : ''}`
                : ''
            }
            value={
              pickerType === 'range'
                ? selectedValue?.[0]?.format(props.format)
                : selectedValue?.format(props.format)
            }
            placeholder={
              Array.isArray(props.placeholder)
                ? props.placeholder[0]
                : props.placeholder
            }
          />
          {pickerType === 'range' && (
            <>
              <HalfArrow size={'1em'} stroke={'currentColor'} strokeWidth={2} />
              <input
                ref={endInputRef}
                type="text"
                autoComplete="off"
                onFocus={() => {
                  setFocusedInputIndex(1);
                }}
                onBlur={() => {
                  handleBlur(1);
                }}
                name={props.name ? `${props.name}[1]` : ''}
                value={selectedValue?.[1]?.format(props.format)}
                placeholder={
                  Array.isArray(props.placeholder)
                    ? props.placeholder[1]
                    : props.placeholder
                }
              />
            </>
          )}
          {props.iconType === 'calendar' && (
            <CalendarIcon size={'1.125em'} strokeWidth={2} />
          )}
          {props.iconType === 'chevron' && (
            <ChevronDown size={'1.125em'} strokeWidth={2} />
          )}
          {selectedValue && (
            <CircleIconButton
              className="clear-input-button"
              type="button"
              darker={true}
              onClick={() => {
                setSelectedValue(undefined);
                startInputRef.current?.focus();
              }}
            >
              <X size={'.8em'} strokeWidth={2} />
            </CircleIconButton>
          )}
        </TextInputWrapper>
      )}
      <DropdownDiv
        ref={dropdownRef}
        className={styles.dropdown}
        visible={
          props.dropdownVisible !== undefined
            ? props.dropdownVisible
            : showPicker
        }
        placement={placement}
        verticlePlacement={verticlePlacement}
        onClick={() => {
          if (focusedInputIndex === 0) {
            startInputRef.current?.focus();
          } else if (focusedInputIndex === 1) {
            endInputRef.current?.focus();
          }
        }}
      >
        <DayMonthYearPicker />
      </DropdownDiv>
    </div>
  );
}

export function DatePicker<PT extends TPicker = 'date'>(
  props: DatePickerProps<PT>
) {
  const {
    pickerType,
    period,
    disabled,
    hidden,
    defaultValue,
    disabledStyle = 'highlighted',
    ...args
  } = props;

  return (
    <DatePickerContextProvider
      disabled={disabled}
      hidden={hidden}
      pickerType={pickerType}
      defaultValue={defaultValue}
      period={period}
      disabledStyle={disabledStyle}
    >
      <UnenrichedDatePicker {...args} />
    </DatePickerContextProvider>
  );
}

const defaultProps: DatePickerProps<TPicker> = {
  period: 'day',
  pickerType: 'date',
  format: 'M/D/YYYY',
  placeholder: 'Select',
  closeOnSelect: true,
  hideInputElement: false,
  iconType: 'calendar',
};

DatePicker.defaultProps = defaultProps;
