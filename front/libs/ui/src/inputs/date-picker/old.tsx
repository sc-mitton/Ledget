import { useState, useRef, useEffect, forwardRef, HTMLProps, createContext, useContext } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import './date-picker.scss'
import { DropDownDiv } from '../../animations/animations';
import { Calendar as CalendarIcon, HalfArrow, CloseIcon, ArrowIcon, DoubleArrow } from '@ledget/media'
import { TextInputWrapper } from '../text/text';
import { IconButton3, CircleIconButton } from '../../buttons/buttons';
import { useAccessEsc } from '../../modal/with-modal/with-modal';


// Types
type PickerType = 'date' | 'range';

type BaseDatePickerProps = {
    name?: string
    format?: 'MM/DD/YYYY' | 'M/D/YYYY' | 'MM/DD/YY' | 'DD/MM/YYYY' | 'DD/MM/YY'
}

type DatePickerProps<T extends PickerType> =
    T extends 'range'
    ? {
        placeholder?: [string, string]
        type?: T
        default?: [Dayjs, Dayjs]
        bounds?: [[Dayjs, Dayjs], [Dayjs, Dayjs]]
        onChange?: (value: [Dayjs, Dayjs]) => void
    } & BaseDatePickerProps
    : {
        placeholder?: string
        type?: T
        multiple?: boolean
        default?: Dayjs
        bounds?: [Dayjs, Dayjs]
        onChange?: (value: Dayjs) => void
    } & BaseDatePickerProps

type DayMonthYearPickerProps = {
    onChange: (value: Dayjs) => void
} & ({
    type: 'range'
    selectedDate?: [Dayjs, Dayjs]
    index?: 0 | 1
} | {
    type: 'date',
    selectedDate?: Dayjs,
    index?: never
})

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
}

type DayPickerProps = {
    onChange: (value: Dayjs) => void
} & ({
    type: 'range'
    selectedDate?: [Dayjs, Dayjs]
    picker: [Dayjs, Dayjs]
    sideOfRange: 'start' | 'end'
} | {
    type: 'date',
    selectedDate?: Dayjs,
    picker: Dayjs,
    sideOfRange?: never
})

type DaysProps = {
    month: number
    year: number
    activeDay?: Dayjs
    setActiveDay: React.Dispatch<React.SetStateAction<Dayjs | undefined>>
}

// Components

const CalendarCell: React.FC<HTMLProps<HTMLTableCellElement> & CalendarCellProps> = (props) => {
    const { isDisabled, isActiveTerminusEnd, isActiveTerminusStart, isActive, isToday,
        isOverflow, isSelected, isTerminusEnd, isTerminusStart, children, ...rest } = props

    return (
        <div {...rest} className={`
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

const DayPicker = ({ selectedDate, onChange, picker, sideOfRange }: DayPickerProps) => {
    const [activeDay, setActiveDay] = useState<Dayjs>()

    const Days = ({ month, year, activeDay, setActiveDay }: DaysProps) => {
        const firstDay = dayjs().month(month).year(year).date(1)

        return (
            <div className="day-calendar">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                {/* Partial Row */}
                {Array.from({ length: firstDay.day() }).map((_, i) => {
                    const day = firstDay.date(0).date(firstDay.date(0).daysInMonth() - (firstDay.day() - i - 1))

                    return (
                        <CalendarCell
                            isDisabled={
                                Array.isArray(selectedDate)
                                    ? sideOfRange === 'start' ? day.isAfter(selectedDate[1], 'day') : day.isBefore(selectedDate[0], 'day')
                                    : false
                            }
                            isOverflow={true}
                        >
                            {day.date()}
                        </CalendarCell>
                    )
                })}
                {/* Days */}
                {Array.from({ length: firstDay.daysInMonth() }).map((_, i) => {
                    const day = dayjs().month(month).year(year).date(i + 1)

                    return (
                        <CalendarCell
                            onMouseEnter={() => setActiveDay(day)}
                            onMouseLeave={() => setActiveDay(undefined)}
                            onFocus={() => setActiveDay(day)}
                            onBlur={() => setActiveDay(undefined)}
                            isDisabled={
                                Array.isArray(selectedDate)
                                    ? sideOfRange === 'start' ? day.isAfter(selectedDate[1], 'day') : day.isBefore(selectedDate[0], 'day')
                                    : false
                            }
                            isActive={sideOfRange === 'start'
                                ? day.isAfter(activeDay)
                                : sideOfRange === 'end' ? day.isBefore(activeDay) : false
                            }
                            isActiveTerminusEnd={sideOfRange === 'end' && day.isSame(activeDay, 'day')}
                            isActiveTerminusStart={sideOfRange === 'start' && day.isSame(activeDay, 'day')}
                            isToday={day.isSame(dayjs(), 'day')}
                            isSelected={Array.isArray(selectedDate)
                                ? day.isAfter(selectedDate[0], 'day') && day.isBefore(selectedDate[1], 'day')
                                : day.isSame(selectedDate, 'day')}
                            isTerminusStart={Array.isArray(selectedDate) && day.isSame(selectedDate[0], 'day')}
                            isTerminusEnd={Array.isArray(selectedDate) && day.isSame(selectedDate[1], 'day')}
                        >{day.date()}
                        </CalendarCell>
                    )
                })}
                {/* Partial Row */}
                {Array.from({ length: 7 - firstDay.add(1, 'month').date(1).day() }).map((_, i) => {
                    const day = dayjs().month(month).year(year).add(1, 'month').date(i + 1)

                    return (
                        <CalendarCell
                            isDisabled={
                                Array.isArray(selectedDate)
                                    ? sideOfRange === 'start' ? day.isAfter(selectedDate[1], 'day') : day.isBefore(selectedDate[0], 'day')
                                    : false
                            }
                            isOverflow={true}
                        >
                            {day.date()}
                        </CalendarCell>)
                })}
            </div>
        )
    }

    return (
        <>
            {Array.isArray(picker)
                ? picker.map((date, i) =>
                    <Days month={date.month()} year={date.year()} activeDay={activeDay} setActiveDay={setActiveDay} />)
                : <Days month={picker.month()} year={picker.year()} activeDay={activeDay} setActiveDay={setActiveDay} />
            }
        </>
    )
}

const DayMonthYearPicker = forwardRef<HTMLDivElement, DayMonthYearPickerProps>((props, ref) => {
    const { selectedDate, onChange, type, index, ...rest } = props
    const [view, setView] = useState<'day' | 'month' | 'year'>('day')

    const [picker, setPicker] = useState<Dayjs | [Dayjs, Dayjs]>()

    // Update the picker range / date
    useEffect(() => {
        setPicker(
            type === 'range'
                ? Array.isArray(selectedDate)
                    ? index === 0
                        ? [selectedDate[0].set('month', selectedDate[0].month() - 1), selectedDate[0]]
                        : [selectedDate[1], selectedDate[1].set('month', selectedDate[1].month() + 1)]
                    : index === 0
                        ? [dayjs().set('month', dayjs().month() - 1), dayjs()]
                        : [dayjs(), dayjs().set('month', dayjs().month() + 1)]
                : selectedDate ? selectedDate : dayjs()
        )
    }, [selectedDate, index, type])

    const handleSeek = (e: any, direction: 1 | -1, speed: 'fast' | 'slow') => {
        e.preventDefault()
        const amount = view !== 'year' ? 1 : 10

        setPicker(prev => {
            if (Array.isArray(prev)) {
                return speed === 'fast'
                    ? [prev[0].add(amount, 'year'), prev[1].add(direction, 'year')]
                    : [prev[0].add(amount, 'month'), prev[1].add(direction, 'month')]
            } else {
                return speed === 'fast'
                    ? prev?.add(amount, 'year')
                    : prev?.add(amount, 'month')
            }
        })
    }

    return (
        <div className="ledget-datepicker--calendar">
            <div tabIndex={0}>
                <div>
                    <IconButton3 onClick={(e) => handleSeek(e, -1, 'fast')}>
                        <DoubleArrow rotation={90} size={'.8em'} />
                    </IconButton3>
                    {view !== 'year' && <IconButton3 onClick={(e) => handleSeek(e, -1, 'slow')}>
                        <ArrowIcon rotation={90} size={'.8em'} />
                    </IconButton3>}
                </div>

                {view === 'day' &&
                    (Array.isArray(picker)
                        ? <>
                            <div>
                                <button>{picker[0].format('MMM')}</button>
                                <button>{picker[0].format('YYYY')}</button>
                            </div>
                            <div>
                                <button>{picker[1].format('MMM')}</button>
                                <button>{picker[1].format('YYYY')}</button>
                            </div>
                        </>
                        : <div>
                            <button>{picker?.format('MMM')}</button>
                            <button>{picker?.format('YYYY')}</button>
                        </div>)}


                <div>
                    {view !== 'year' && <IconButton3 onClick={(e) => handleSeek(e, 1, 'slow')}>
                        <ArrowIcon rotation={-90} size={'.8em'} />
                    </IconButton3>}
                    <IconButton3 onClick={(e) => handleSeek(e, 1, 'fast')}>
                        <DoubleArrow rotation={-90} size={'.8em'} />
                    </IconButton3>
                </div>
            </div>
            <div tabIndex={0}>
                {/* If the view is day, have a component for the days of the month
        which takes as props the onChange callback and the current value */}

                {view === 'day' && picker &&
                    ((Array.isArray(picker) && type === 'range')
                        ? <DayPicker
                            type={'range'}
                            picker={picker}
                            sideOfRange={index === 0 ? 'start' : 'end'}
                            selectedDate={selectedDate}
                            onChange={(value) => setPicker(value)}
                        />
                        : !Array.isArray(picker) && type === 'date' &&
                        <DayPicker
                            type={'date'}
                            picker={picker}
                            selectedDate={selectedDate}
                            onChange={(value) => setPicker(value)}
                        />)}

                {/* If the view is month, then have a component for the months of the year
        which takes as props a callback to set the month for the calendar. After selection,
        the view will change to day */}

                {/* If the view is year, then have a component for the years
        which takes as props a callback to set the year for the calendar. After selection,
        the view will change to month */}
            </div>
        </div>
    )
})

export function DatePicker<PT extends PickerType = 'date'>(props: DatePickerProps<PT>) {
    const [value, setValue] = useState<[Dayjs, Dayjs] | Dayjs | undefined>(Array.isArray(props.default)
        ? [dayjs(props.default[0]), dayjs(props.default[1])] as const
        : props.default ? dayjs(props.default) : undefined)
    const [focused, setFocused] = useState<0 | 1>()
    const [showPicker, setShowPicker] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputContainerRef = useRef<HTMLDivElement>(null)
    const [placement, setPlacement] = useState<'left' | 'right'>('left')

    useAccessEsc({
        visible: showPicker,
        setVisible: setShowPicker,
        refs: [dropdownRef, inputContainerRef]
    })

    useEffect(() => { !showPicker && setFocused(undefined) }, [showPicker])
    useEffect(() => { focused !== undefined && setShowPicker(true) }, [focused])

    // If the left side of the dropdown div is on the right
    // side of the screen, put it on the left, otherwise put it on the right
    useEffect(() => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect()
            rect.left > window.innerWidth / 2 ? setPlacement('right') : setPlacement('left')
        }
    }, [dropdownRef, showPicker])

    return (
        <div className='ledget-datepicker--container'>
            <TextInputWrapper
                focused={showPicker}
                className={`ledget-datepicker
          ${props.type === 'range' && focused !== undefined ? `focused-${focused}` : ''}
          ${props.type === 'range' ? 'range' : 'single'}
          ${Array.isArray(value) ? value[0] && value[1] ? 'filled' : 'unfilled' : value ? 'filled' : 'unfilled'}`}
                slim={true}
                ref={inputContainerRef}
            >
                <input
                    readOnly
                    autoComplete='off'
                    onFocus={() => setFocused(0)}
                    name={`${props.name}${Array.isArray(value) ? '[0]' : ''}`}
                    value={Array.isArray(value) ? value[0].format(props.format) : value?.format(props.format)}
                    placeholder={Array.isArray(props.placeholder) ? props.placeholder[0] : props.placeholder}
                />
                {Array.isArray(value)
                    &&
                    <>
                        <HalfArrow size={'.7em'} stroke={'currentColor'} />
                        <input
                            readOnly
                            autoComplete='off'
                            onFocus={() => setFocused(1)}
                            name={`${props.name}[1]`}
                            value={value[1].format(props.format)}
                            placeholder={props.placeholder?.[1]} />
                    </>
                }
                {focused !== undefined &&
                    <CircleIconButton darker={true} size={'1.25em'} onClick={() => setValue(undefined)}>
                        <CloseIcon stroke={'currentColor'} size={'.6em'} />
                    </CircleIconButton>}
                <CalendarIcon fill={'currentColor'} size={'1.1em'} />
            </TextInputWrapper>
            <DropDownDiv ref={dropdownRef} visible={showPicker} placement={placement}>
                {Array.isArray(value)
                    ? <DayMonthYearPicker
                        type={'range'}
                        index={focused === 0 ? 0 : 1}
                        selectedDate={value}
                        onChange={(value) => console.log('value')}
                    />
                    : <DayMonthYearPicker
                        type={'date'}
                        selectedDate={value}
                        onChange={(value) => console.log('value')}
                    />}
            </DropDownDiv>
        </div>
    )
}

DatePicker.defaultProps = {
    type: 'date',
    placeholder: 'Select a date',
    multiple: false,
    bounds: [new Date('1/1/1900'), new Date('1/1/2200')],
    format: 'M/D/YYYY',
    onChange: () => { },
}

export default function () {

    return (
        <DatePicker />
    )

}



