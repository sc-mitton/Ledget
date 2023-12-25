import React, { FC, useState, useEffect, useRef, useContext, createContext } from 'react'

import { UseFormRegister, FieldError } from 'react-hook-form'

import './styles/Dropdowns.css'
import './styles/Scheduler.scss'
import Radios from './Radios'
import type { Bill } from '@features/billSlice'
import { useClickClose } from '@ledget/ui'
import { ArrowIcon } from '@ledget/media'
import { SlimmestInputButton, InputButton, FormErrorTip, DropDownDiv, getDaySuffix } from '@ledget/ui'
import { Calendar } from '@ledget/media'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface Context extends Pick<Bill, 'day' | 'week' | 'month'> {
    open: boolean,
    weekDay: Bill['week_day'],
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setDay: React.Dispatch<React.SetStateAction<Bill['day']>>,
    setWeek: React.Dispatch<React.SetStateAction<Bill['week']>>,
    setWeekDay: React.Dispatch<React.SetStateAction<Bill['week_day']>>,
    setMonth: React.Dispatch<React.SetStateAction<Bill['month']>>,
    buttonRef: React.RefObject<HTMLButtonElement>
}

const pickerContext = createContext<Context | null>(null)

const usePickerContext = () => {
    const context = useContext(pickerContext)
    if (!context) {
        throw new Error('usePickerContext must be used within a Scheduler')
    }
    return context
}

const Scheduler = (props: Omit<Context, 'open' | 'setOpen' | 'buttonRef'> & { children: React.ReactNode }) => {
    const {
        day, setDay, month, setMonth, week, setWeek, weekDay, setWeekDay, children
    } = props
    const [open, setOpen] = useState(false)
    const buttonRef = useRef(null)

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
    }

    return (
        <pickerContext.Provider value={data}>
            {children}
        </pickerContext.Provider>
    )
}

const Button: FC<React.HTMLAttributes<HTMLButtonElement> & { iconPlaceholder?: boolean }> = ({ children, iconPlaceholder, ...props }) => {
    const Component = iconPlaceholder ? InputButton : SlimmestInputButton

    const [placeholder, setPlaceholder] = useState('')
    const {
        open,
        setOpen,
        buttonRef,
        day,
        week,
        weekDay,
        month,
    } = usePickerContext()

    useEffect(() => {
        if (month && day) {
            setPlaceholder(`${months[month]} ${day}${getDaySuffix(day)}`)
        } else if (week && weekDay) {
            setPlaceholder(`${week}${getDaySuffix(week)} ${dayMap[weekDay]}`)
        } else if (day) {
            setPlaceholder(`The ${day}${getDaySuffix(day)}`)
        }
    }, [day, month, week, weekDay])

    return (
        <>
            <Component
                onClick={() => setOpen(!open)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        setOpen(!open)
                    }
                }}
                ref={buttonRef}
                tabIndex={0}
                role="button"
                type="button"
                name="schedule-dropdown"
                id="schedule-dropdown-button"
                aria-label="Open schedule dropdown"
                aria-haspopup="true"
                aria-expanded={`${open}`}
                aria-controls="schedule-dropdown"
                style={{
                    color: placeholder ? 'var(--m-text)' : 'var(--input-placeholder2)'
                }}
                {...props}
            >
                {iconPlaceholder
                    ?
                    <><Calendar size={'1.25em'} />{placeholder}</>
                    : <div>
                        <span>
                            {placeholder || 'Repeats on'}
                        </span>
                    </div>}
                <ArrowIcon size={'.8em'} stroke={'currentColor'} />
                {children}
            </Component>
        </>

    )
}

const options = [
    { label: 'Day', value: 'day', default: true },
    { label: 'Week', value: 'week', default: false },
]

const ModeSelector = ({ mode, setMode }: {
    mode: typeof options[number]['value'],
    setMode: React.Dispatch<React.SetStateAction<typeof options[number]['value']>>
}) => {

    return (
        <Radios
            value={mode}
            onChange={setMode}
            style={{
                borderRadius: 'var(--border-radius2)',
                backgroundColor: 'none',
                display: 'inline-block',
            }}
        >
            <Radios.Pill styles={{
                backgroundColor: 'var(--btn-mid-gray)',
                borderRadius: 'var(--border-radius2)'
            }} />
            {options.map((option) => (
                <Radios.Input
                    key={option.value}
                    option={option}
                    style={{
                        padding: '0 .75em',
                        cursor: 'pointer'
                    }}
                >
                    {({ selected }: { selected: any }) => (
                        <span
                            style={{
                                color: selected
                                    ? 'var(--m-invert-text)'
                                    : 'var(--m-text-tirtiary)',
                                fontWeight: '400'
                            }}
                        >
                            {option.label}
                        </span>
                    )}
                </Radios.Input>
            ))}
        </Radios>
    )
}

// How many days are in each month
const daysMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

const DayPicker = () => {

    const { setOpen, day, setDay, month } = usePickerContext()
    const [numberOfDays, setNumberOfDays] = useState<number>(daysMap[month || 1])
    const [activeDay, setActiveDay] = useState<typeof day>(0)
    const ref = useRef<HTMLDivElement>(null)

    const Day = ({ dayNumber }: { dayNumber: NonNullable<typeof day> }) => (
        <td key={dayNumber}>
            <div
                className={`day picker-item
                    ${day === dayNumber ? 'selected' : 'unselected'}
                    ${activeDay === dayNumber ? 'active' : ''}
                    `}
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
    )

    useEffect(() => {
        setNumberOfDays(daysMap[month || 1])
    }, [month])

    const Row = ({ number }: { number: number }) => (
        <tr>
            {Array.from({ length: 7 }, (_, i) =>
                <Day key={i} dayNumber={i + 1 + (7 * number) as NonNullable<typeof day>} />
            )}
        </tr>
    )

    const PartialRow = () => (
        <tr>
            {Array.from({ length: numberOfDays - 28 }, (_, i) =>
                <Day key={i + 29} dayNumber={i + 29 as NonNullable<typeof day>} />
            )}
        </tr>
    )

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.shiftKey || event.altKey || event.ctrlKey) {
            return
        }
        if (activeDay === undefined) return

        switch (event.key) {
            case 'ArrowRight':
                setActiveDay(activeDay < numberOfDays ? activeDay + 1 as typeof activeDay : 1)
                break
            case 'ArrowLeft':
                setActiveDay(activeDay > 1 ? activeDay - 1 as typeof activeDay : numberOfDays)
                break
            case 'ArrowUp':
                if (activeDay <= (numberOfDays - 28)) {
                    setActiveDay(activeDay + 28 as typeof activeDay)
                } else if (activeDay >= (numberOfDays - 28) && activeDay <= 7) {
                    setActiveDay(activeDay + 21 as typeof activeDay)
                } else {
                    setActiveDay(activeDay ? activeDay - 7 as typeof activeDay : numberOfDays)
                }
                break
            case 'ArrowDown':
                if (activeDay > 28) {
                    setActiveDay(activeDay - 28 as typeof activeDay)
                } else if (activeDay > (numberOfDays - 7)) {
                    setActiveDay(activeDay - 21 as typeof activeDay)
                } else {
                    setActiveDay(activeDay ? activeDay + 7 as typeof activeDay : 1)
                }
                break
            case 'Tab':
                setOpen(false)
                break
            case 'Enter':
                setDay(activeDay)
                break
            default:
                break
        }
    }

    useEffect(() => {
        ref.current?.focus()
    }, [])

    return (
        <div
            className="day-picker"
            ref={ref}
            onBlur={() => {
                setActiveDay(undefined)
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
    )
}

const WeekPicker = () => {
    const {
        week: weekNumber,
        setWeek: setWeekNumber,
        weekDay,
        setWeekDay,
        setOpen
    } = usePickerContext()

    const [activeWeekNumber, setActiveWeekNumber] = useState<typeof weekNumber>()
    const [activeWeekDay, setActiveWeekDay] = useState<typeof weekDay>()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        ref.current?.focus()
    }, [])

    const formatWeek = (weekNumber: number) => {
        switch (weekNumber) {
            case 1:
                return 'st'
            case 2:
                return 'nd'
            case 3:
                return 'rd'
            case 4:
                return 'th'
            default:
                return
        }
    }

    const formatWeekDay = (weekDayNumber: number) => {
        switch (weekDayNumber) {
            case 1:
                return 'Sun'
            case 2:
                return 'Mon'
            case 3:
                return 'Tue'
            case 4:
                return 'Wed'
            case 5:
                return 'Thu'
            case 6:
                return 'Fri'
            case 7:
                return 'Sat'
            default:
                return ''
        }
    }

    const WeekNumber = ({ week }: { week: NonNullable<typeof weekNumber> }) => (
        <li>
            <div
                className={`picker-item
                    ${week === weekNumber ? 'selected' : 'unselected'}
                    ${week === activeWeekNumber ? 'active' : ''}
                    `}
                onClick={() => {
                    setWeekNumber(week)
                }}
                role="button"
                aria-label={`Select week ${week}`}
                aria-pressed={`${week === weekNumber}`}
                aria-selected={`${week === weekNumber}`}
                tabIndex={-1}
            >
                {week <= 4 && `${week}`}
                {week > 4 && 'Last'}
                <span style={{
                    fontSize: '.8em',
                }}>
                    {formatWeek(week)}
                </span>
            </div>
        </li>
    )

    const WeekDay = ({ dayNumber }: { dayNumber: NonNullable<typeof weekDay> }) => (
        <li>
            <div
                className={`picker-item
                    ${weekDay === dayNumber ? 'selected' : 'unselected'}
                    ${activeWeekDay === dayNumber ? 'active' : ''}
                    `}
                onClick={() =>
                    setWeekDay(dayNumber)
                }
                role="button"
                aria-label={`Select day ${dayNumber}`}
                aria-pressed={`${weekDay === dayNumber}`}
                aria-selected={`${weekDay === dayNumber}`}
                tabIndex={-1}
            >
                {formatWeekDay(dayNumber)}
            </div>
        </li>
    )

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowRight':
                if (activeWeekNumber) {
                    setActiveWeekNumber(activeWeekNumber < 5 ? activeWeekNumber + 1 as typeof activeWeekNumber : 1)
                } else if (activeWeekDay) {
                    setActiveWeekDay(activeWeekDay < 7 ? activeWeekDay + 1 as typeof activeWeekDay : 1)
                } else {
                    setActiveWeekNumber(1)
                }
                break
            case 'ArrowLeft':
                if (activeWeekNumber) {
                    setActiveWeekNumber(activeWeekNumber > 1 ? activeWeekNumber - 1 as typeof activeWeekNumber : 5)
                } else if (activeWeekDay) {
                    setActiveWeekDay(activeWeekDay > 1 ? activeWeekDay - 1 as typeof activeWeekDay : 7)
                } else {

                }
                break
            case 'ArrowUp':
                if (activeWeekDay) {
                    setActiveWeekNumber(Math.min(5, activeWeekDay) as typeof activeWeekNumber)
                    setActiveWeekDay(undefined)
                }
                break
            case 'ArrowDown':
                if (activeWeekNumber) {
                    setActiveWeekDay(activeWeekNumber)
                    setActiveWeekNumber(undefined)
                }
                break
            case 'Tab':
                setOpen(false)
                break
            case 'Enter':
                if (activeWeekNumber) {
                    setWeekNumber(activeWeekNumber)
                }
                if (activeWeekDay) {
                    setWeekDay(activeWeekDay)
                }
                break
            default:
                break
        }
    }

    return (
        <div
            className="week-picker-container"
            ref={ref}
            onBlur={() => {
                setActiveWeekDay(undefined)
                setActiveWeekNumber(undefined)
            }}
            onMouseEnter={() => {
                setActiveWeekDay(undefined)
                setActiveWeekNumber(undefined)
            }}
            onKeyDown={(event) => handleKeyDown(event)}
            tabIndex={0}
        >
            <ul
                className="week-picker"
                role="listbox"
                aria-label="Select week number"
                aria-activedescendant={`week-${activeWeekNumber}`}
                aria-orientation="horizontal"
                aria-multiselectable="false"
                aria-disabled="false"
            >
                {
                    Array.from({ length: 5 }, (_, i) =>
                        <WeekNumber key={i + 1} week={i + 1 as NonNullable<typeof weekNumber>} />
                    )
                }
            </ul>
            <hr
                style={{
                    width: '100%',
                }}
            />
            <ul
                className="week-day-picker"
                role="listbox"
                aria-label="Select week day"
                aria-activedescendant={`week-day-${activeWeekDay}`}
                aria-orientation="horizontal"
                aria-multiselectable="false"
                aria-disabled="false"
            >
                {
                    Array.from({ length: 7 }, (_, i) =>
                        <WeekDay key={i + 1} dayNumber={i + 1 as NonNullable<typeof weekDay>} />
                    )
                }
            </ul>
        </div>
    )
}

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
    } = usePickerContext()

    const ref = useRef<HTMLDivElement>(null)
    const [mode, setMode] = useState<typeof options[number]['value']>('day')

    useEffect(() => {
        open
            ? ref.current?.focus()
            : ref.current?.blur()
    }, [open])

    useClickClose({
        refs: [ref, buttonRef],
        visible: open,
        setVisible: setOpen
    })

    // Clear other inputs different
    // mode's inputs are entered
    useEffect(() => {
        if (day) {
            setWeek(undefined)
            setWeekDay(undefined)
            setOpen(false)
        }
    }, [day])

    // Clear other inputs different mode's
    // inputs are entered
    useEffect(() => {
        if (week || weekDay) {
            setDay(undefined)
        }
        if (week && weekDay) {
            setOpen(false)
        }
    }, [weekDay, week])

    return (
        <>
            <DropDownDiv
                placement='left'
                visible={open}
                id="schedule-dropdown"
            >
                <div
                    ref={ref}
                    onKeyDown={(event) => {
                        event.stopPropagation()
                        if (event.key === 'Escape') {
                            setOpen(false)
                        }
                    }}
                >
                    <ModeSelector mode={mode} setMode={setMode} />
                    {mode === 'day' && <DayPicker />}
                    {mode === 'week' && <WeekPicker />}
                </div>
            </DropDownDiv>
        </>
    )
}

const MonthPicker = () => {
    const { month, setMonth, setOpen } = usePickerContext()

    const [activeMonth, setActiveMonth] = useState<typeof month>()
    const ref = useRef<HTMLDivElement>(null)

    const translateMonthNumber = (monthNumber: typeof month) => {
        // Lookup table
        return monthNumber ? months[monthNumber] : months[1]
    }

    const Month = ({ monthNumber }: { monthNumber: typeof month }) => (
        <li>
            <div
                className={`picker-item
                    ${month === monthNumber ? 'selected' : 'unselected'}
                    ${activeMonth === monthNumber ? 'active' : ''}
                    `}
                onClick={() => setMonth(monthNumber)}
                role="button"
                aria-label={`Select month ${monthNumber}`}
                aria-pressed={`${month === monthNumber}`}
                aria-selected={`${month === monthNumber}`}
                tabIndex={-1}
            >
                {translateMonthNumber(monthNumber)}
            </div>
        </li>
    )

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!activeMonth)
            return

        const key = event.key
        const actions = {
            ArrowRight: () => {
                setActiveMonth(activeMonth < 12 ? activeMonth + 1 as typeof month : 1)
            },
            ArrowLeft: () => {
                setActiveMonth(activeMonth > 1 ? activeMonth - 1 as typeof month : 12)
            },
            ArrowUp: () => {
                setActiveMonth(activeMonth > 6 ? activeMonth - 6 as typeof month : activeMonth)
            },
            ArrowDown: () => {
                setActiveMonth(activeMonth < 6 ? activeMonth + 6 as typeof month : activeMonth)
            },
            Enter: () => {
                setMonth(activeMonth)
            },
            Tab: () => {
                setActiveMonth(undefined)
            },
            Escape: () => {
                setOpen(false)
            },
            default: () => { }
        }
        const action = actions[key as keyof typeof actions] || actions['default']
        action()
    }

    useEffect(() => {
        ref.current?.focus()
    }, [])

    return (
        <div
            id="month-picker2-container"
            ref={ref}
            onBlur={() => {
                setActiveMonth(undefined)
            }}
            onMouseEnter={() => {
                setActiveMonth(undefined)
            }}
            onKeyDown={(event) => handleKeyDown(event)}
            tabIndex={0}
        >
            <ul
                id="month-picker2"
                role="listbox"
                aria-label="Select month number"
                aria-activedescendant={`month-${setActiveMonth}`}
                aria-orientation="horizontal"
                aria-multiselectable="false"
                aria-disabled="false"
            >
                <div>
                    {Array.from({ length: 6 }, (_, i) =>
                        <Month key={i + 1} monthNumber={i + 1 as typeof month} />
                    )}
                </div>
                <div>
                    {Array.from({ length: 6 }, (_, i) =>
                        <Month key={i + 7} monthNumber={i + 7 as typeof month} />
                    )}
                </div>
            </ul>
        </div>
    )
}

const MonthDayPicker = () => {
    const { open, setOpen, buttonRef, month, day } = usePickerContext()

    const ref = useRef<HTMLDivElement>(null)

    useClickClose({
        refs: [ref, buttonRef],
        visible: open,
        setVisible: setOpen
    })

    useEffect(() => {
        open
            ? ref.current?.focus()
            : ref.current?.blur()
    }, [open])

    useEffect(() => {
        if (month && day) {
            setOpen(false)
        }
    }, [month, day])

    return (
        <>
            <DropDownDiv
                placement='left'
                visible={open}
                id="schedule-dropdown"
                style={{ marginTop: '.5em' }}
            >
                <div
                    id="month-day-picker-container"
                    ref={ref}
                    onKeyDown={(event) => {
                        event.stopPropagation()
                        if (event.key === 'Escape') {
                            setOpen(false)
                        }
                    }}
                >
                    <MonthPicker />
                    <hr style={{ opacity: '.7', margin: '.5em 0', width: '100%' }} />
                    <DayPicker />
                </div>
            </DropDownDiv>
        </>
    )
}

type defaultValue = Pick<Bill, 'day' | 'month' | 'week'> & { weekDay: Bill['week_day'] }

interface BSP {
    billPeriod: Bill['period'],
    defaultValue?: defaultValue,
    setHasSchedule?: React.Dispatch<React.SetStateAction<boolean>>,
    error?: FieldError
    register: UseFormRegister<any>
    iconPlaceholder?: boolean
}

export const BillScheduler = (props: BSP) => {
    const { billPeriod, error, defaultValue, register } = props

    const [day, setDay] = useState(defaultValue?.day)
    const [month, setMonth] = useState(defaultValue?.month)
    const [week, setWeek] = useState(defaultValue?.week)
    const [weekDay, setWeekDay] = useState(defaultValue?.weekDay)

    useEffect(() => {
        if (day || month || (week && weekDay))
            props.setHasSchedule && props.setHasSchedule(true)
        else
            props.setHasSchedule && props.setHasSchedule(false)
    }, [day, month, week, weekDay])

    return (
        <>
            {month &&
                <input type="hidden" value={month} {...register('month')} />}
            {day &&
                <input type="hidden" value={day} {...register('day')} />}
            {weekDay &&
                <input type="hidden" value={weekDay} {...register('week_day')} />}
            {week &&
                <input type="hidden" value={week} {...register('week')} />}
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
                <div id="scheduler--container">
                    <Scheduler.Button iconPlaceholder={props.iconPlaceholder}>
                        {error &&
                            <FormErrorTip error={{ type: 'required' }} />}
                    </Scheduler.Button>
                    <div>
                        {billPeriod === 'month'
                            ? <Scheduler.DayWeekPicker />
                            : <Scheduler.MonthDayPicker />
                        }
                    </div>
                </div>
            </Scheduler>
        </>
    )
}

Scheduler.Button = Button
Scheduler.DayWeekPicker = DayWeekPicker
Scheduler.MonthDayPicker = MonthDayPicker

export default Scheduler
