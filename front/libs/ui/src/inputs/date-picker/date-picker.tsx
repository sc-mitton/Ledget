import { useState, useRef, useEffect, useCallback, HTMLProps, createContext, useContext } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import './date-picker.scss'
import { DropDownDiv } from '../../animations/animations';
import { Calendar as CalendarIcon, HalfArrow, CloseIcon, ArrowIcon, DoubleArrow } from '@ledget/media'
import { TextInputWrapper } from '../text/text';
import { IconButton3, CircleIconButton } from '../../buttons/buttons';
import { useAccessEsc } from '../../modal/with-modal/with-modal';
import { start } from 'repl';


// Types
type TPicker = 'date' | 'range';

type TSelectedValue<T extends TPicker> =
  T extends 'range'
  ? [Dayjs, Dayjs] | [Dayjs, undefined] | [undefined, Dayjs]
  : Dayjs

type BaseDatePickerProps = {
  name?: string
  format?: 'MM/DD/YYYY' | 'M/D/YYYY' | 'MM/DD/YY' | 'DD/MM/YYYY' | 'DD/MM/YY'
  closeOnSelect?: boolean
}

type DatePickerProps<T extends TPicker> =
  T extends 'range'
  ? {
    placeholder?: [string, string]
    pickerType: T
    defaultValue?: [Dayjs, Dayjs]
    bounds?: [[Dayjs, Dayjs], [Dayjs, Dayjs]]
    onChange?: (value?: TSelectedValue<T>) => void
  } & BaseDatePickerProps
  : {
    placeholder?: string
    pickerType: T
    defaultValue?: Dayjs
    bounds?: [Dayjs, Dayjs]
    onChange?: (value?: TSelectedValue<T>) => void
  } & BaseDatePickerProps

type UnenrichedDatePickerProps<T extends TPicker> = Omit<DatePickerProps<T>, 'bounds' | 'pickerType'>

type DatePickerContextProps<T extends TPicker> = Pick<DatePickerProps<T>, 'defaultValue' | 'bounds' | 'pickerType'>

type TDatePickerContext<TP extends TPicker> =
  (TP extends 'range'
    ? {
      pickerType: TP
      selectedValue?: TSelectedValue<TP>
      setSelectedValue: React.Dispatch<TSelectedValue<TP> | undefined>
      inputTouchCount: [number, number]
      setInputTouchCount: React.Dispatch<React.SetStateAction<[number, number] | undefined>>
    }
    : {
      pickerType: TP
      selectedValue?: TSelectedValue<TP>
      setSelectedValue: React.Dispatch<TSelectedValue<TP> | undefined>
      inputTouchCount: number
      setInputTouchCount: React.Dispatch<React.SetStateAction<number | undefined>>
    }) & {
      focusedInputIndex?: 0 | 1
      setFocusedInputIndex: React.Dispatch<React.SetStateAction<0 | 1 | undefined>>
    } & DatePickerContextProps<TP>

type CalendarCellProps = {
  isDisabled?: boolean
  isOverflow?: boolean
  isTerminusStart?: boolean
  isTerminusEnd?: boolean
  isActive?: boolean
  isSelected?: boolean
  isToday?: boolean
  isActiveTerminusStart?: boolean
  isActiveTerminusEnd?: boolean
  extraPadded?: boolean
}

type DaysProps = {
  month: number
  year: number
  activeDay?: Dayjs
  setActiveDay: React.Dispatch<React.SetStateAction<Dayjs | undefined>>
}

type YearsMonthsProps = {
  windowCenter: Dayjs
  onSelect: (month: Dayjs) => void
}

// Context
const datePickerContext = createContext<TDatePickerContext<TPicker> | undefined>(undefined)

const DatePickerContextProvider = <TP extends TPicker>({ children, pickerType, bounds, defaultValue }:
  DatePickerContextProps<TP> & { children: React.ReactNode }) => {

  const [selectedValue, setSelectedValue] = useState<typeof defaultValue>(defaultValue)
  const [focusedInputIndex, setFocusedInputIndex] = useState<TDatePickerContext<TP>['focusedInputIndex']>()
  const [inputTouchCount, setInputTouchCount] = useState<TDatePickerContext<TP>['inputTouchCount']>(pickerType === 'range' ? [0, 0] : 0)

  useEffect(() => {
    setSelectedValue(defaultValue)
  }, [defaultValue])

  return (
    <datePickerContext.Provider
      value={{
        selectedValue,
        setSelectedValue,
        focusedInputIndex,
        setFocusedInputIndex,
        pickerType,
        bounds,
        inputTouchCount,
        setInputTouchCount
      } as any}
    >
      {children}
    </datePickerContext.Provider>
  )
}

const useDatePickerContext = () => {
  const context = useContext(datePickerContext)
  if (!context) throw new Error('useDatePickerContext must be used within a DatePickerContextProvider')
  return context
}


// Components

const PickerCell: React.FC<HTMLProps<HTMLTableCellElement> & CalendarCellProps> = (props) => {
  const { isDisabled, isActiveTerminusEnd, isActiveTerminusStart, isActive, isToday,
    isOverflow, isSelected, isTerminusEnd, isTerminusStart, children, extraPadded, ...rest } = props

  return (
    <div {...rest} className={`
        cell
        ${extraPadded ? 'extra-padded' : ''}
        ${isOverflow ? 'overflow' : ''}
        ${isDisabled ? 'disabled' : ''}
        ${isActive ? 'active' : ''}
        ${isSelected ? 'selected' : ''}
        ${isTerminusStart ? 'terminus-start' : ''}
        ${isToday ? 'today' : ''}
        ${isActiveTerminusStart ? 'active-terminus-start' : ''}
        ${isActiveTerminusEnd ? 'active-terminus-end' : ''}
        ${isTerminusEnd ? 'terminus-end' : ''}
      `}>
      {children}
    </div>
  )
}

const Years = ({ windowCenter, onSelect }: YearsMonthsProps) => {
  const { pickerType, selectedValue, focusedInputIndex, inputTouchCount } = useDatePickerContext()

  const [active, setActive] = useState<Dayjs>()

  return (
    <div className="year-calendar">
      <PickerCell
        onClick={() => { onSelect(windowCenter.year(Math.round(windowCenter.year() / 10) * 10).subtract(1, 'year')) }}
        extraPadded={true}
        isOverflow={true}
      >
        {windowCenter.year(Math.round(windowCenter.year() / 10) * 10).subtract(1, 'year').format('YYYY')}
      </PickerCell>
      <>
        {Array.from({ length: 10 }).map((_, i) => {
          const djs = windowCenter.year(Math.round(windowCenter.year() / 10) * 10).add(i, 'year')
          const isDisabled = pickerType === 'range' && (inputTouchCount[focusedInputIndex || 0] > 1 || selectedValue?.[focusedInputIndex || 0] === undefined)
            ? focusedInputIndex === 0
              ? selectedValue?.[1] ? djs.isAfter(selectedValue[1], 'year') : false
              : selectedValue?.[0] ? djs.isBefore(selectedValue[0], 'year') : false
            : false
          const isActive = active
            ? pickerType === 'range'
              ? focusedInputIndex === 0
                ? djs.isAfter(active) && djs.isBefore(selectedValue?.[1], 'year')
                : djs.isBefore(active) && djs.isAfter(selectedValue?.[0], 'year')
              : djs.isAfter(active)
            : false
          const isSelected = pickerType === 'range'
            ? selectedValue?.every(v => v)
              ? djs.isAfter(selectedValue?.[0], 'year') && djs.isBefore(selectedValue?.[1], 'year')
              : false
            : false

          return (<PickerCell
            onClick={() => { onSelect(djs) }}
            extraPadded={true}

            onMouseEnter={() => setActive(djs)}
            isDisabled={isDisabled}
            isActive={isActive}

            isActiveTerminusEnd={pickerType === 'range' && focusedInputIndex === 1 && djs.isSame(active, 'year') && djs.isAfter(selectedValue?.[0], 'year')}
            isActiveTerminusStart={pickerType === 'range' && focusedInputIndex === 0 && djs.isSame(active, 'year') && djs.isBefore(selectedValue?.[1], 'year')}

            isSelected={isSelected}
            isTerminusStart={pickerType === 'range' && selectedValue?.[0] && djs.isSame(selectedValue[0], 'year')}
            isTerminusEnd={pickerType === 'range' && selectedValue?.[1] && djs.isSame(selectedValue[1], 'year')}
          >
            {djs.format('YYYY')}
          </PickerCell>)
        })}
      </>
      <PickerCell
        onClick={() => { onSelect(windowCenter.add(10, 'year')) }}
        extraPadded={true}
        isOverflow={true}
      >
        {windowCenter.year(Math.round(windowCenter.year() / 10) * 10 + 10).format('YYYY')}
      </PickerCell>
    </div>
  )
}

const Months = ({ windowCenter, onSelect }: YearsMonthsProps) => {
  const [activeMonth, setActiveMonth] = useState<Dayjs>()
  const { selectedValue, setSelectedValue, pickerType, focusedInputIndex, inputTouchCount, bounds } = useDatePickerContext()

  return (
    <div
      className="month-calendar"
      onMouseLeave={() => setActiveMonth(undefined)}
    >
      <>
        {Array.from({ length: 12 }).map((_, i) => {
          const djs = windowCenter.month(i)
          const isActive = pickerType === 'range' && activeMonth
            ? focusedInputIndex === 0
              ? djs.isAfter(activeMonth, 'month') && djs.isBefore(selectedValue?.[1], 'month')
              : djs.isBefore(activeMonth, 'month') && djs.isAfter(selectedValue?.[0], 'month')
            : false

          return (
            <PickerCell
              onMouseEnter={() => setActiveMonth(djs)}
              isActive={isActive}
              isDisabled={false}
              onClick={() => { onSelect(djs) }}
              isActiveTerminusEnd={pickerType === 'range' && focusedInputIndex === 1 && djs.isSame(activeMonth, 'month') && djs.isAfter(selectedValue?.[0], 'day')}
              isActiveTerminusStart={pickerType === 'range' && focusedInputIndex === 0 && djs.isSame(activeMonth, 'month') && djs.isBefore(selectedValue?.[1], 'day')}
              isTerminusStart={pickerType === 'range' && djs.isSame(selectedValue?.[0], 'month')}
              isTerminusEnd={pickerType === 'range' && djs.isSame(selectedValue?.[1], 'month')}
              extraPadded={true}
            >
              {djs.month(i).format('MMM')}
            </PickerCell>)
        })}
      </>
    </div>
  )

}

const Days = ({ month, year, activeDay, setActiveDay }: DaysProps) => {
  const firstDay = dayjs().month(month).year(year).date(1)
  const {
    selectedValue,
    setSelectedValue,
    pickerType,
    bounds,
    inputTouchCount,
    focusedInputIndex
  } = useDatePickerContext()

  const handleClick = (day: Dayjs, reset = false) => {
    pickerType === 'range'
      ? focusedInputIndex === 0
        ? reset ? setSelectedValue([day, undefined]) : setSelectedValue([day, selectedValue?.[1]])
        : reset ? setSelectedValue([undefined, day]) : setSelectedValue([selectedValue?.[0], day])
      : setSelectedValue(day)
  }

  const checkedDisabled = useCallback((day: Dayjs) => {
    const disabled = pickerType === 'range' && (inputTouchCount[focusedInputIndex || 0] > 1 || selectedValue?.[focusedInputIndex || 0] === undefined)
      ? focusedInputIndex === 0
        ? selectedValue?.[1] ? day.isAfter(selectedValue[1], 'day') : false
        : selectedValue?.[0] ? day.isBefore(selectedValue[0], 'day') : false
      : false
    return disabled
  }, [selectedValue, focusedInputIndex, pickerType, inputTouchCount])

  const unsetActiveDay = () => { setActiveDay(undefined) }

  return (
    <div className="day-calendar" onMouseLeave={unsetActiveDay}>
      <div onMouseEnter={unsetActiveDay}>Su</div>
      <div onMouseEnter={unsetActiveDay}>Mo</div>
      <div onMouseEnter={unsetActiveDay}>Tu</div>
      <div onMouseEnter={unsetActiveDay}>We</div>
      <div onMouseEnter={unsetActiveDay}>Th</div>
      <div onMouseEnter={unsetActiveDay}>Fr</div>
      <div onMouseEnter={unsetActiveDay}>Sa</div>
      {/* Partial Row */}
      {Array.from({ length: firstDay.day() }).map((_, i) => {
        const day = firstDay.date(0).date(firstDay.date(0).daysInMonth() - (firstDay.day() - i - 1))
        const disabled = checkedDisabled(day)
        return (
          <PickerCell
            onMouseEnter={unsetActiveDay}
            onClick={() => !disabled && handleClick(day, true)}
            isDisabled={disabled}
            isOverflow={true}
          >
            {day.date()}
          </PickerCell>
        )
      })}
      {/* Days */}
      {Array.from({ length: firstDay.daysInMonth() }).map((_, i) => {
        const day = dayjs().month(month).year(year).date(i + 1)
        const isActive = activeDay
          ? pickerType === 'range'
            ? focusedInputIndex === 0
              ? day.isAfter(activeDay) && day.isBefore(selectedValue?.[1], 'day')
              : day.isBefore(activeDay) && day.isAfter(selectedValue?.[0], 'day')
            : day.isAfter(activeDay)
          : false

        const isSelected = pickerType === 'range'
          ? selectedValue?.every(v => v)
            ? day.isAfter(selectedValue?.[0], 'day') && day.isBefore(selectedValue?.[1], 'day')
            : false
          : false
        const isActiveTerminusEnd = pickerType === 'range' && focusedInputIndex === 1 && day.isSame(activeDay, 'day') && day.isAfter(selectedValue?.[0], 'day')
        const isActiveTerminusStart = pickerType === 'range' && focusedInputIndex === 0 && day.isSame(activeDay, 'day') && day.isBefore(selectedValue?.[1], 'day')
        const isDisabled = checkedDisabled(day)

        return (
          <PickerCell
            onClick={() => handleClick(day, isSelected || (!isActive && !isActiveTerminusEnd && !isActiveTerminusStart))}
            onMouseEnter={() => selectedValue && setActiveDay(day)}
            isDisabled={isDisabled}
            isActive={isActive}
            isActiveTerminusEnd={isActiveTerminusEnd}
            isActiveTerminusStart={isActiveTerminusStart}
            isToday={day.isSame(dayjs(), 'day')}
            isSelected={isSelected}
            isTerminusStart={pickerType === 'range' && selectedValue?.[0] && day.isSame(selectedValue[0], 'day')}
            isTerminusEnd={pickerType === 'range' && selectedValue?.[1] && day.isSame(selectedValue[1], 'day')}
          >
            {day.date()}
          </PickerCell>
        )
      })}
      {/* Partial Row */}
      {Array.from({ length: 7 - firstDay.add(1, 'month').date(1).day() }).map((_, i) => {
        const day = dayjs().month(month).year(year).add(1, 'month').date(i + 1)
        const disabled = checkedDisabled(day)

        return (
          <PickerCell
            onMouseEnter={unsetActiveDay}
            onClick={() => !disabled && handleClick(day, true)}
            isDisabled={disabled}
            isOverflow={true}
          >
            {day.date()}
          </PickerCell>)
      })}
      {/* Sixth Row */}
      {(firstDay.daysInMonth() + firstDay.day() + 7 - firstDay.add(1, 'month').date(1).day()) <= 35 &&
        Array.from({ length: 7 }).map((_, i) => {

          const day = dayjs().month(month).year(year)
            .add(1, 'month')
            .add(7 - firstDay.add(1, 'month').date(1).day(), 'day').date(i + 1)
          const disabled = checkedDisabled(day)

          return (
            <PickerCell
              onMouseEnter={unsetActiveDay}
              onClick={() => !disabled && handleClick(day, true)}
              isDisabled={disabled}
              isOverflow={true}
            >
              {day.date()}
            </PickerCell>)
        })}
    </div>
  )
}

const DayMonthYearPicker = () => {

  const { pickerType, selectedValue, focusedInputIndex } = useDatePickerContext()

  const [view, setView] = useState<'day' | 'month' | 'year'>('day')
  const [windowCenter, setWindowCenter] = useState<Dayjs>()
  const [activeCell, setActiveCell] = useState<Dayjs>()

  // Update the picker range / date
  useEffect(() => {
    const invertFocusIndex = focusedInputIndex === 0 ? 1 : 0

    pickerType === 'range'
      ? selectedValue
        ? setWindowCenter(selectedValue[focusedInputIndex || 0] || selectedValue[invertFocusIndex])
        : setWindowCenter(dayjs())
      : selectedValue ? setWindowCenter(selectedValue) : setWindowCenter(dayjs())
  }, [selectedValue, pickerType, focusedInputIndex])

  const handleSeek = (e: any, direction: 1 | -1, speed: 'fast' | 'slow') => {
    e.preventDefault()

    const distance = {
      amount: view === 'year' ? 10 : speed === 'fast' && view !== 'day' ? 10 : 1,
      period: view === 'year' ? 'year' : speed === 'fast' ? 'year' : 'month'
    } as const

    setWindowCenter(prev => prev ? prev.add(distance.amount * direction, distance.period) : dayjs())
  }

  return (
    <div className="ledget-datepicker--calendar">
      <div>
        <div>
          <IconButton3 onClick={(e) => handleSeek(e, -1, 'fast')}>
            <DoubleArrow rotation={90} size={'.8em'} />
          </IconButton3>
          {view !== 'year' && <IconButton3 onClick={(e) => handleSeek(e, -1, 'slow')}>
            <ArrowIcon rotation={90} size={'.8em'} />
          </IconButton3>}
        </div>
        {focusedInputIndex === 0 && pickerType === 'range' && view === 'day' &&
          <div>
            <button onClick={() => setView('month')}>
              {windowCenter?.subtract(1, 'month').format('MMM')}
            </button>
            <button onClick={() => setView('year')}>
              {windowCenter?.subtract(1, 'month').format('YYYY')}
            </button>
          </div>}
        <div>
          {view === 'day' && <button onClick={() => setView('month')}>
            {windowCenter?.format('MMM')}
          </button>}
          {view !== 'year' && <button onClick={() => setView('year')}>
            {windowCenter?.format('YYYY')}
          </button>}
          {view === 'year' && windowCenter && <span>
            {dayjs().year(Math.round(windowCenter.year() / 10) * 10).format('YYYY')}
            {' - '}
            {dayjs().year(Math.round(windowCenter.year() / 10) * 10 + 9).format('YYYY')}
          </span>}
        </div>
        {focusedInputIndex === 1 && pickerType === 'range' && view === 'day' &&
          <div>
            <button onClick={() => setView('month')}>
              {windowCenter?.add(1, 'month').format('MMM')}
            </button>
            <button onClick={() => setView('year')}>
              {windowCenter?.add(1, 'month').format('YYYY')}
            </button>
          </div>}
        <div>
          {view !== 'year' && <IconButton3 onClick={(e) => handleSeek(e, 1, 'slow')}>
            <ArrowIcon rotation={-90} size={'.8em'} />
          </IconButton3>}
          <IconButton3 onClick={(e) => handleSeek(e, 1, 'fast')}>
            <DoubleArrow rotation={-90} size={'.8em'} />
          </IconButton3>
        </div>
      </div>
      <div>
        {/* Lowest level of selection, the day */}
        {view === 'day' && focusedInputIndex === 0 &&
          <Days
            month={windowCenter?.subtract(1, 'month').month() || 0}
            year={windowCenter?.subtract(1, 'month').year() || 0}
            activeDay={activeCell}
            setActiveDay={setActiveCell}
          />}
        {view === 'day' &&
          <Days
            month={windowCenter?.month() || 0}
            year={windowCenter?.year() || 0}
            activeDay={activeCell}
            setActiveDay={setActiveCell}
          />}
        {view === 'day' && focusedInputIndex === 1 &&
          <Days
            month={windowCenter?.add(1, 'month').month() || 0}
            year={windowCenter?.add(1, 'month').year() || 0}
            activeDay={activeCell}
            setActiveDay={setActiveCell}
          />}

        {/* If the view is month, then have a component for the months of the year
          which takes as props a callback to set the month for the calendar. After selection,
          the view will change to day */}
        {view === 'month' &&
          <Months
            windowCenter={windowCenter || dayjs()}
            onSelect={(month) => {
              setWindowCenter(month)
              setView('day')
            }}
          />}

        {/* If the view is year, then have a component for the years
          which takes as props a callback to set the year for the calendar. After selection,
          the view will change to month */}

        {view === 'year' &&
          <Years
            windowCenter={windowCenter || dayjs()}
            onSelect={(month) => {
              setWindowCenter(month)
              setView('month')
            }}
          />}

      </div>
    </div>
  )
}

function UnenrichedDatePicker(props: UnenrichedDatePickerProps<TPicker>) {
  const {
    focusedInputIndex,
    setFocusedInputIndex,
    inputTouchCount,
    setInputTouchCount,
    pickerType,
    selectedValue,
    setSelectedValue,
  } = useDatePickerContext()

  const [showPicker, setShowPicker] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const [placement, setPlacement] = useState<'left' | 'right'>('left')
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)

  useAccessEsc({
    visible: showPicker,
    setVisible: setShowPicker,
    refs: [dropdownRef, inputContainerRef]
  })

  // Once the value has been selected, if closeOnSelect is true, close the picker
  useEffect(() => {
    if (props.closeOnSelect) {
      pickerType === 'range'
        ? selectedValue?.every(v => v) && setShowPicker(false)
        : selectedValue && setShowPicker(false)
    }
  }, [selectedValue])

  useEffect(() => {

    // Clear inputs if needed
    if ((pickerType === 'range' && !selectedValue?.[0]) || !selectedValue) {
      if (startInputRef.current) {
        startInputRef.current.value = '';
      }
    }
    if ((pickerType === 'range' && !selectedValue?.[1]) || !selectedValue) {
      if (endInputRef.current) {
        endInputRef.current.value = '';
      }
    }

    if (pickerType === 'range' && selectedValue) {
      if (focusedInputIndex === 0) {
        setFocusedInputIndex(1)
        setInputTouchCount([inputTouchCount[0] + 1, inputTouchCount[1]])
        endInputRef.current?.focus()
      } else if (focusedInputIndex === 1) {
        if (selectedValue[0]) {
          setFocusedInputIndex(undefined)
          endInputRef.current?.blur()
        } else {
          setFocusedInputIndex(0)
          setInputTouchCount([inputTouchCount[0], inputTouchCount[1] + 1])
          startInputRef.current?.focus()
        }
      }
    } else if (selectedValue) {
      setShowPicker(false)
      setFocusedInputIndex(undefined)
    }
    // props.onChange && props.onChange(selectedValue as any)
  }, [selectedValue])

  // Clear the focused input index when the picker is closed
  useEffect(() => {
    if (!showPicker) {
      setFocusedInputIndex(undefined)
      if (pickerType === 'range') {
        setInputTouchCount([0, 0])
      } else {
        setInputTouchCount(0)
      }
    }
  }, [showPicker])

  // When the input is focused, show the picker
  useEffect(() => { focusedInputIndex !== undefined && setShowPicker(true) }, [focusedInputIndex])

  // If the left side of the dropdown div is on the right
  // side of the screen, put it on the left, otherwise put it on the right
  useEffect(() => {
    if (inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect()
      rect.left > window.innerWidth / 2 ? setPlacement('right') : setPlacement('left')
    }
  }, [inputContainerRef, showPicker])

  return (
    <div className='ledget-datepicker--container'>
      <TextInputWrapper
        focused={showPicker}
        className={`ledget-datepicker
          ${pickerType === 'range' ? selectedValue?.some(v => v) ? 'filled' : '' : selectedValue ? 'filled' : ''}
          ${focusedInputIndex !== undefined ? `focused-${focusedInputIndex}` : ''}
          ${pickerType === 'range' ? 'range' : 'single'}
          ${pickerType === 'range'}`}
        slim={true}
        ref={inputContainerRef}
      >
        <input
          ref={startInputRef}
          autoComplete='off'
          type='text'
          onFocus={() => { setFocusedInputIndex(0) }}
          onBlur={() => {
            if (showPicker) {
              pickerType === 'range'
                ? setInputTouchCount([inputTouchCount[0] + 1, inputTouchCount[1]])
                : setInputTouchCount(inputTouchCount + 1)
            }
          }}
          name={`${props.name}${pickerType === 'range' ? '[0]' : ''}`}
          value={pickerType === 'range' ? selectedValue?.[0]?.format(props.format) : selectedValue?.format(props.format)}
          placeholder={Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder}
        />
        {pickerType === 'range'
          &&
          <>
            <HalfArrow size={'.7em'} stroke={'currentColor'} />
            <input
              ref={endInputRef}
              type='text'
              autoComplete='off'
              onFocus={() => { setFocusedInputIndex(1) }}
              onBlur={() => { showPicker && setInputTouchCount([inputTouchCount[0], inputTouchCount[1] + 1]) }}
              name={`${props.name}[1]`}
              value={selectedValue?.[1]?.format(props.format)}
              placeholder={props.placeholder?.[1]} />
          </>
        }
        {selectedValue &&
          <CircleIconButton
            type='button'
            darker={true}
            size={'1.25em'}
            onClick={() => { setSelectedValue(undefined) }}
          >
            <CloseIcon stroke={'currentColor'} size={'.6em'} />
          </CircleIconButton>}
        <CalendarIcon fill={'currentColor'} size={'1.1em'} />
      </TextInputWrapper>
      <DropDownDiv
        ref={dropdownRef}
        visible={showPicker}
        placement={placement}
        onClick={() => {
          if (focusedInputIndex === 0) {
            startInputRef.current?.focus()
          } else if (focusedInputIndex === 1) {
            endInputRef.current?.focus()
          }
        }}
      >
        <DayMonthYearPicker />
      </DropDownDiv>
    </div>
  )
}

export function DatePicker<PT extends TPicker = 'date'>(props: DatePickerProps<PT>) {
  const {
    bounds,
    pickerType = 'date',
    defaultValue,
    ...rest
  } = props

  return (
    <DatePickerContextProvider
      bounds={bounds}
      pickerType={pickerType}
      defaultValue={defaultValue}
    >
      <UnenrichedDatePicker {...rest} />
    </DatePickerContextProvider>
  )
}

const defaultProps: DatePickerProps<TPicker> = {
  pickerType: 'date',
  format: 'MM/DD/YYYY',
  placeholder: 'Select',
  closeOnSelect: true
}

DatePicker.defaultProps = defaultProps
