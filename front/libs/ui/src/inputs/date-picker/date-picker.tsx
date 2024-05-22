import { useState, useRef, useEffect, useCallback, HTMLProps, createContext, useContext, memo } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Tool } from '@geist-ui/icons'

import './date-picker.scss'
import { DropDownDiv } from '../../animations/animations';
import { HalfArrow } from '@ledget/media'
import { TextInputWrapper } from '../text/text';
import { Tooltip } from '../../pieces/tooltip/tooltip';
import { IconButton3, CircleIconButton, BlueTextButton } from '../../buttons/buttons';
import { useAccessEsc } from '../../modal/with-modal/with-modal';
import { useLoaded } from '../../utils/hooks';

// Types
type TPicker = 'date' | 'range';

type TSelectedValue<T extends TPicker> =
  T extends 'range'
  ? [Dayjs | undefined, Dayjs | undefined]
  : Dayjs

type BaseDatePickerProps = {
  name?: string
  period: 'day' | 'month' | 'year'
  format?: 'MM/DD/YYYY' | 'M/D/YYYY' | 'MM/DD/YY' | 'DD/MM/YYYY' | 'DD/MM/YY'
  closeOnSelect?: boolean
  disabled?: [Dayjs | undefined, Dayjs | undefined][]
  hidden?: [Dayjs | undefined, Dayjs | undefined][]
  disabledStyle?: 'muted' | 'highlighted'
  autoFocus?: boolean
  placement?: 'left' | 'right' | 'middle'
} & ({
  hideInputElement: true,
  dropdownVisible: boolean,
  setDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>,
} | {
  hideInputElement: false,
  dropdownVisible?: never
  setDropdownVisible?: never,
})

type DatePickerProps<T extends TPicker> =
  T extends 'range'
  ? {
    placeholder?: [string, string]
    pickerType: T
    defaultValue?: [Dayjs, Dayjs]
    onChange?: (value?: [Dayjs, Dayjs]) => void
  } & BaseDatePickerProps
  : {
    placeholder?: string
    pickerType: T
    defaultValue?: Dayjs
    onChange?: (value?: Dayjs) => void
  } & BaseDatePickerProps

type P = 'defaultValue' | 'disabled' | 'pickerType' | 'period' | 'hidden' | 'disabledStyle'
type UnenrichedDatePickerProps<T extends TPicker> = Omit<DatePickerProps<T>, P>
type DatePickerContextProps<T extends TPicker> = Pick<DatePickerProps<T>, P>

type TDatePickerContext<TP extends TPicker> =
  (TP extends 'range'
    ? {
      pickerType: TP
      selectedValue?: TSelectedValue<TP>
      setSelectedValue: React.Dispatch<TSelectedValue<TP> | undefined>
      inputTouchCount: [number, number]
      disabled?: [[Dayjs, Dayjs] | undefined, [Dayjs, Dayjs] | undefined]
      setInputTouchCount: React.Dispatch<React.SetStateAction<[number, number] | undefined>>
    }
    : {
      pickerType: TP
      selectedValue?: TSelectedValue<TP>
      setSelectedValue: React.Dispatch<TSelectedValue<TP> | undefined>
      inputTouchCount: number
      disabled?: [Dayjs, Dayjs]
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

const DatePickerContextProvider = <TP extends TPicker>({ children, pickerType, defaultValue, ...rest }:
  DatePickerContextProps<TP> & { children: React.ReactNode }) => {

  const [selectedValue, setSelectedValue] = useState<typeof defaultValue>()
  const [focusedInputIndex, setFocusedInputIndex] = useState<TDatePickerContext<TP>['focusedInputIndex']>()
  const [inputTouchCount, setInputTouchCount] = useState<TDatePickerContext<TP>['inputTouchCount']>(pickerType === 'range' ? [0, 0] : 0)

  useEffect(() => {
    !selectedValue && setSelectedValue(defaultValue)
  }, [defaultValue])

  return (
    <datePickerContext.Provider
      value={{
        selectedValue,
        setSelectedValue,
        focusedInputIndex,
        setFocusedInputIndex,
        pickerType,
        inputTouchCount,
        setInputTouchCount,
        ...rest
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
  const { disabledStyle } = useDatePickerContext()

  return (
    <div {...rest} className={`
        cell
        ${extraPadded ? 'extra-padded' : ''}
        ${isOverflow ? 'overflow' : ''}
        ${isDisabled ? `disabled ${disabledStyle}` : ''}
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

const EmptyPickerCell = ({ period }: { period: 'day' | 'year' | 'month' }) => (
  <div className={`cell empty ${period !== 'day' ? 'extra-padded' : ''}`}>
    {period === 'day' ? 1
      : period === 'month' ? 'Jan'
        : '2020'}
  </div>
)

const checkDisabled = (point: Dayjs, period: DatePickerProps<TPicker>['period'], disabled?: DatePickerProps<TPicker>['disabled']) => {
  // Is range type if condition met
  if (!disabled) return false

  return disabled.some(window => {
    if (window?.[0] && window?.[1]) {
      return (point.isAfter(window[0], period) && point.isBefore(window[1]), period)
        || point.isSame(window[0], period) || point.isSame(window[1], period)
    } else if (window?.[1] === undefined) {
      return point.isSame(window[0], period) || point.isAfter(window[0], period)
    } else if (window?.[0] === undefined) {
      return point.isSame(window[1], period) || point.isBefore(window[1], period)
    }
  })
}

const Years = ({ windowCenter, onSelect }: YearsMonthsProps) => {
  const { pickerType, selectedValue, focusedInputIndex, inputTouchCount, disabled, hidden, period } = useDatePickerContext()

  const [active, setActive] = useState<Dayjs>()

  return (
    <div className="year-calendar">
      {Array.from({ length: 12 }).map((_, i) => {
        const djs = i === 0
          ? windowCenter.year(Math.round(windowCenter.year() / 10) * 10).subtract(1, 'year')
          : i === 11 ? windowCenter.year(Math.round(windowCenter.year() / 10) * 10 + 10)
            : windowCenter.year(Math.round(windowCenter.year() / 10) * 10).add(i, 'year')

        const isActive = active
          ? pickerType === 'range'
            ? focusedInputIndex === 0
              ? djs.isAfter(active) && djs.isBefore(selectedValue?.[1], 'year')
              : djs.isBefore(active) && djs.isAfter(selectedValue?.[0], 'year')
            : false
          : false
        const isSelected = pickerType === 'range'
          ? selectedValue?.every(v => v)
            ? djs.isAfter(selectedValue?.[0], 'year') && djs.isBefore(selectedValue?.[1], 'year')
            : false
          : false
        const unSelectable = pickerType === 'range'
          ? focusedInputIndex === 0
            ? selectedValue?.[1] && djs.isAfter(selectedValue?.[1], 'year')
            : selectedValue?.[0] && djs.isBefore(selectedValue?.[0], 'year')
          : false
        const ignoreUnSelectable = pickerType === 'range' && (!selectedValue?.[focusedInputIndex || 0] || inputTouchCount[focusedInputIndex || 0] < 1)
        const isDisabled = checkDisabled(djs, period, disabled)
        const isHidden = checkDisabled(djs, period, hidden)

        return (
          isHidden
            ? <EmptyPickerCell period="year" />
            : <PickerCell
              onClick={() => { onSelect(djs) }}
              extraPadded={true}
              onMouseEnter={() => setActive(djs)}
              isDisabled={(unSelectable || isDisabled) && !ignoreUnSelectable}
              isActive={isActive}
              isSelected={isSelected}
              isActiveTerminusEnd={pickerType === 'range' && focusedInputIndex === 1 && djs.isSame(active, 'year') && djs.isAfter(selectedValue?.[0], 'year')}
              isActiveTerminusStart={pickerType === 'range' && focusedInputIndex === 0 && djs.isSame(active, 'year') && djs.isBefore(selectedValue?.[1], 'year')}
              isTerminusStart={pickerType === 'range' ? selectedValue?.[0] && djs.isSame(selectedValue[0], 'year') : djs.isSame(selectedValue, 'year')}
              isTerminusEnd={pickerType === 'range' ? selectedValue?.[1] && djs.isSame(selectedValue[1], 'year') : djs.isSame(selectedValue, 'year')}
            >
              {djs.format('YYYY')}
            </PickerCell>)
      })}
    </div>
  )
}

const Months = ({ windowCenter, onSelect }: YearsMonthsProps) => {
  const [activeMonth, setActiveMonth] = useState<Dayjs>()
  const { selectedValue, pickerType, focusedInputIndex, disabled, hidden, inputTouchCount, period } = useDatePickerContext()

  return (
    <div className="month-calendar" onMouseLeave={() => setActiveMonth(undefined)}>
      <>
        {Array.from({ length: 12 }).map((_, i) => {
          const djs = windowCenter.month(i)
          const isActive = pickerType === 'range' && activeMonth
            ? focusedInputIndex === 0
              ? djs.isAfter(activeMonth, 'month') && djs.isBefore(selectedValue?.[1], 'month')
              : djs.isBefore(activeMonth, 'month') && djs.isAfter(selectedValue?.[0], 'month')
            : false
          const isSelected =
            pickerType === 'range'
              ? selectedValue?.every(v => v)
                ? djs.isAfter(selectedValue?.[0], 'month') && djs.isBefore(selectedValue?.[1], 'month')
                : false
              : false
          const unSelectable = pickerType === 'range'
            ? focusedInputIndex === 0
              ? selectedValue?.[1] && djs.isAfter(selectedValue?.[1], 'month')
              : selectedValue?.[0] && djs.isBefore(selectedValue?.[0], 'month')
            : false
          const ignoreUnSelectable = pickerType === 'range' && (!selectedValue?.[focusedInputIndex || 0] || inputTouchCount[focusedInputIndex || 0] < 1)
          const isDisabled = checkDisabled(djs, period, disabled)
          const isHidden = checkDisabled(djs, period, hidden)

          return (
            isHidden
              ? <EmptyPickerCell period="month" />
              : <PickerCell
                onMouseEnter={() => setActiveMonth(djs)}
                isActive={isActive}
                isDisabled={(unSelectable || isDisabled) && !ignoreUnSelectable}
                onClick={() => { onSelect(djs) }}
                isSelected={isSelected}
                isActiveTerminusEnd={pickerType === 'range' && focusedInputIndex === 1 && djs.isSame(activeMonth, 'month') && djs.isAfter(selectedValue?.[0], 'day')}
                isActiveTerminusStart={pickerType === 'range' && focusedInputIndex === 0 && djs.isSame(activeMonth, 'month') && djs.isBefore(selectedValue?.[1], 'day')}
                isTerminusStart={pickerType === 'range' ? djs.isSame(selectedValue?.[0], 'month') : djs.isSame(selectedValue, 'month')}
                isTerminusEnd={pickerType === 'range' ? djs.isSame(selectedValue?.[1], 'month') : djs.isSame(selectedValue, 'month')}
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
  const {
    selectedValue,
    setSelectedValue,
    pickerType,
    disabled,
    hidden,
    inputTouchCount,
    focusedInputIndex,
    period
  } = useDatePickerContext()
  const [firstDay, setFirstDay] = useState<Dayjs>()
  const [days, setDays] = useState<number[]>()

  const handleClick = (day: Dayjs, reset = false) => {
    pickerType === 'range'
      ? focusedInputIndex === 0
        ? reset ? setSelectedValue([day, undefined]) : setSelectedValue([day, selectedValue?.[1]])
        : reset ? setSelectedValue([undefined, day]) : setSelectedValue([selectedValue?.[0], day])
      : setSelectedValue(day)
  }

  const unsetActiveDay = () => { setActiveDay(undefined) }

  useEffect(() => {
    setFirstDay(dayjs().month(month).year(year).date(1))
  }, [month, year])

  useEffect(() => {
    if (!firstDay) return

    setDays(Array.from({ length: firstDay.day() }).map((_, i) => i).concat(
      Array.from({ length: firstDay.daysInMonth() }).map((_, i) => i).concat(
        Array.from({ length: 7 - firstDay.add(1, 'month').date(1).day() }).map((_, i) => i).concat(
          Array.from({ length: (firstDay.daysInMonth() + firstDay.day() > 35 ? 0 : 7) }).map((_, i) => i + 7 - firstDay.add(1, 'month').date(1).day())))))

  }, [firstDay])

  return (
    <div className="day-calendar" onMouseLeave={unsetActiveDay}>
      <div onMouseEnter={unsetActiveDay}>Su</div>
      <div onMouseEnter={unsetActiveDay}>Mo</div>
      <div onMouseEnter={unsetActiveDay}>Tu</div>
      <div onMouseEnter={unsetActiveDay}>We</div>
      <div onMouseEnter={unsetActiveDay}>Th</div>
      <div onMouseEnter={unsetActiveDay}>Fr</div>
      <div onMouseEnter={unsetActiveDay}>Sa</div>
      {days?.map((date, i) => {
        const day = date === i
          ? dayjs().month(month).year(year).startOf('month').subtract(dayjs().month(month).year(year).startOf('month').day() - i, 'day')
          : (i - date) > 10
            ? dayjs().month(month).year(year).date(date + 1).add(1, 'month')
            : dayjs().month(month).year(year).date(date + 1)

        const isOverflow = day.month() !== month
        const ignoreUnSelectable = pickerType === 'range' && (!selectedValue?.[focusedInputIndex || 0] || inputTouchCount[focusedInputIndex || 0] < 1)
        const unSelectable = pickerType === 'range'
          ? focusedInputIndex === 0
            ? selectedValue?.[1] && day.isAfter(selectedValue?.[1], 'day')
            : selectedValue?.[0] && day.isBefore(selectedValue?.[0], 'day')
          : false
        const isDisabled = checkDisabled(day, period, disabled)
        const isHidden = checkDisabled(day, period, hidden)
        const isActive = activeDay && !isOverflow
          ? pickerType === 'range'
            ? focusedInputIndex === 0
              ? day.isAfter(activeDay) && day.isBefore(selectedValue?.[1], 'day')
              : day.isBefore(activeDay) && day.isAfter(selectedValue?.[0], 'day')
            : false
          : false
        const isSelected = pickerType === 'range' && !isOverflow
          ? selectedValue?.every(v => v)
            ? day.isAfter(selectedValue?.[0], 'day') && day.isBefore(selectedValue?.[1], 'day')
            : false
          : false
        const isActiveTerminusEnd = pickerType === 'range' && focusedInputIndex === 1 && day.isSame(activeDay, 'day') && day.isAfter(selectedValue?.[0], 'day')
        const isActiveTerminusStart = pickerType === 'range' && focusedInputIndex === 0 && day.isSame(activeDay, 'day') && day.isBefore(selectedValue?.[1], 'day')
        const isTerminusStart = pickerType === 'range'
          ? selectedValue?.[0] && day.isSame(selectedValue[0], 'day')
          : selectedValue && day.isSame(selectedValue, 'day')
        const isTerminusEnd = pickerType === 'range'
          ? selectedValue?.[1] && day.isSame(selectedValue[1], 'day')
          : selectedValue && day.isSame(selectedValue, 'day')


        return (
          isHidden
            ? <EmptyPickerCell period="day" />
            : <PickerCell
              onClick={() => {
                isOverflow
                  ? handleClick(day, true) :
                  !isDisabled && handleClick(day, isSelected || (!isActive && !isActiveTerminusEnd && !isActiveTerminusStart))
              }}
              onMouseEnter={() =>
                !isOverflow
                  ? selectedValue && setActiveDay(day)
                  : setActiveDay(undefined)
              }
              isDisabled={(unSelectable || isDisabled) && !ignoreUnSelectable}
              isActive={isActive}
              isActiveTerminusEnd={!isOverflow && isActiveTerminusEnd}
              isActiveTerminusStart={!isOverflow && isActiveTerminusStart}
              isToday={!isOverflow && day.isSame(dayjs(), 'day')}
              isSelected={!isOverflow && isSelected}
              isTerminusStart={!isOverflow && isTerminusStart}
              isTerminusEnd={!isOverflow && isTerminusEnd}
              isOverflow={isOverflow}
            >
              <Tooltip msg={day.format('YYYY-M-D')}>{day.date()}</Tooltip>
            </PickerCell>
        )
      })}
    </div >
  )
}

const DayMonthYearPicker = () => {

  const { pickerType, selectedValue, focusedInputIndex, period } = useDatePickerContext()

  const [view, setView] = useState<'day' | 'month' | 'year'>(period)
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

  const handleSeek = (e: any, direction: 1 | -1, speed: 'normal' | 'fast') => {
    e.preventDefault()

    const seekPeriod = view === 'day' ? 'month' : view === 'month' ? 'year' : 'year'
    const amount = speed === 'normal'
      ? view === 'year' ? 10 : 1
      : view === 'day' ? 12 : 10

    setWindowCenter(windowCenter?.add(direction * amount, seekPeriod))
  }

  return (
    <div className="ledget-datepicker--calendar">
      {/* Header */}
      <div>
        <div>
          <IconButton3
            onClick={(e) => handleSeek(e, -1, 'fast')}>
            <ChevronsLeft size="1.25em" />
          </IconButton3>
          {view !== 'year' &&
            <IconButton3
              onClick={(e) => handleSeek(e, -1, 'normal')}>
              <ChevronLeft size="1.25em" />
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
          {view !== 'year' &&
            <IconButton3
              onClick={(e) => handleSeek(e, 1, 'normal')}>
              <ChevronRight size="1.25em" />
            </IconButton3>}
          <IconButton3
            onClick={(e) => handleSeek(e, 1, 'fast')}>
            <ChevronsRight size="1.25em" />
          </IconButton3>
        </div>
      </div>
      {/* Items Pick */}
      <div>
        {/* Lowest level of selection, the day */}
        {view === 'day' && pickerType === 'range' && windowCenter &&
          <>
            <Days
              month={focusedInputIndex === 0 ? windowCenter.subtract(1, 'month').month() : windowCenter.month()}
              year={focusedInputIndex === 0 ? windowCenter.subtract(1, 'month').year() : windowCenter.year()}
              activeDay={activeCell}
              setActiveDay={setActiveCell}
            />
            <Days
              month={focusedInputIndex === 1 ? windowCenter.add(1, 'month').month() : windowCenter.month()}
              year={focusedInputIndex === 1 ? windowCenter.add(1, 'month').year() : windowCenter.year()}
              activeDay={activeCell}
              setActiveDay={setActiveCell}
            />
          </>}
        {view === 'day' && windowCenter && pickerType !== 'range' &&
          <Days
            month={windowCenter.month()}
            year={windowCenter.year()}
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
              !['month', 'year'].includes(period) && setView('day')
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
              period !== 'year' && setView('month')
            }}
          />}
      </div>
      {/* Today Window Seek */}
      <div>
        <BlueTextButton
          type='button'
          onClick={() => { setWindowCenter(dayjs()) }}
          aria-label='Go to today'
        >
          Today
        </BlueTextButton>
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
  const [placement, setPlacement] = useState<'left' | 'right' | 'middle'>(props.placement || 'left')
  const [verticlePlacement, setVerticlePlacement] = useState<'top' | 'bottom'>('bottom')
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)
  const loaded = useLoaded(200)

  useAccessEsc(props.dropdownVisible !== undefined && props.setDropdownVisible !== undefined
    ? { refs: [dropdownRef], visible: props.dropdownVisible, setVisible: props.setDropdownVisible }
    : { refs: [dropdownRef, inputContainerRef], visible: showPicker, setVisible: setShowPicker })

  // Once the value has been selected, if closeOnSelect is true, close the picker
  useEffect(() => {
    if (props.closeOnSelect) {
      pickerType === 'range'
        ? selectedValue?.every(v => v) && setShowPicker(false)
        : selectedValue && setShowPicker(false)
    }
  }, [selectedValue])

  useEffect(() => {
    if (!loaded) return

    if (pickerType === 'range') {
      if (!selectedValue?.[0] && !selectedValue?.[1]) {
        setInputTouchCount([0, 0])
        if (startInputRef.current) {
          startInputRef.current.value = '';
        }
        if (endInputRef.current) {
          endInputRef.current.value = '';
        }
      } else if (selectedValue?.[0]) {
        setInputTouchCount([inputTouchCount[0] + 1, inputTouchCount[1]])
        setFocusedInputIndex(1)
        endInputRef.current?.focus()
      } else if (selectedValue?.[1]) {
        setInputTouchCount([inputTouchCount[0], inputTouchCount[1] + 1])
        setFocusedInputIndex(0)
        startInputRef.current?.focus()
      }
    } else {
      setShowPicker(false)
      setFocusedInputIndex(undefined)
      startInputRef.current?.blur()
    }

  }, [selectedValue])

  // Call the onchange callback as the selected value changes
  useEffect(() => {
    if (props.onChange) {
      if (pickerType === 'range' && selectedValue?.every(v => v !== undefined)) {
        props.onChange(selectedValue as any)
      } else if (pickerType === 'date') {
        props.onChange(selectedValue as any)
      }
    }
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
    if (props.placement) return

    if (inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect()
      rect.left > window.innerWidth / 2 ? setPlacement('right') : setPlacement('left')
      rect.top > window.innerHeight / 2 ? setVerticlePlacement('top') : setVerticlePlacement('bottom')
    }
  }, [inputContainerRef, showPicker])

  const handleBlur = (inputIndex: number) => {
    if (showPicker) {
      pickerType === 'range'
        && inputIndex === 0
        ? setInputTouchCount([inputTouchCount[0] + 1, inputTouchCount[1]])
        : pickerType === 'range' && setInputTouchCount([inputTouchCount[0], inputTouchCount[1] + 1])
    } else {
      if (pickerType === 'range') {
        !selectedValue?.[0] && setSelectedValue(undefined)
        !selectedValue?.[1] && setSelectedValue(undefined)
      }
    }
  }

  return (
    <div className='ledget-datepicker--container' style={{ display: verticlePlacement === 'top' ? 'flex' : '' }}>
      {!props.hideInputElement && <TextInputWrapper
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
          onBlur={() => { handleBlur(0) }}
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
              onBlur={() => { handleBlur(1) }}
              name={`${props.name}[1]`}
              value={selectedValue?.[1]?.format(props.format)}
              placeholder={Array.isArray(props.placeholder) ? props.placeholder[1] : props.placeholder}
            />
          </>
        }
        <CalendarIcon size={'1em'} />
        {selectedValue &&
          <CircleIconButton
            className="clear-input-button"
            type='button'
            darker={true}
            onClick={() => { setSelectedValue(undefined) }}
          >
            <X size={'.8em'} />
          </CircleIconButton>}
      </TextInputWrapper>}
      <DropDownDiv
        ref={dropdownRef}
        visible={props.dropdownVisible !== undefined ? props.dropdownVisible : showPicker}
        placement={placement}
        verticlePlacement={verticlePlacement}
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

  const { pickerType, period, disabled, hidden, defaultValue, disabledStyle = 'highlighted', ...args } = props

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
  )
}

const defaultProps: DatePickerProps<TPicker> = {
  period: 'day',
  pickerType: 'date',
  format: 'M/D/YYYY',
  placeholder: 'Select',
  closeOnSelect: true,
  hideInputElement: false,
}

DatePicker.defaultProps = defaultProps
