import React, { useState, useRef, useContext } from 'react'

import './styles/Dropdowns.css'
import './styles/Scheduler.css'
import { DropAnimation } from '@utils'
import Radios from './Radios'
import Arrow from '@assets/icons/Arrow'
import Calendar from '@assets/icons/Calendar'
import { useEffect } from 'react'
import { useClickClose } from '@utils'

const pickerContext = React.createContext()

const Scheduler = ({ children }) => {
    const [open, setOpen] = useState('')
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [week, setWeek] = useState('')
    const [weekDay, setWeekDay] = useState('')
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

const Button = ({ children, ...props }) => {
    const getSuffix = (day) => {
        if (day > 10 && day < 20) return 'th'
        switch (day % 10) {
            case 1:
                return 'st'
            case 2:
                return 'nd'
            case 3:
                return 'rd'
            default:
                return 'th'
        }
    }
    const dayMap = {
        1: 'Sunday', 2: 'Monday', 3: 'Tuesday', 4: 'Wednesday',
        5: 'Thursday', 6: 'Friday', 7: 'Saturday',
    }
    const monthMap = {
        1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
        5: 'May', 6: 'June', 7: 'Jul', 8: 'Aug',
        9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
    }

    const [placeholder, setPlaceholder] = useState('')
    const {
        open,
        setOpen,
        buttonRef,
        day,
        week,
        weekDay,
        month,
    } = useContext(pickerContext)

    useEffect(() => {
        if (month && day) {
            setPlaceholder(`${monthMap[month]} ${day}${getSuffix(day)}`)
        } else if (week && weekDay) {
            setPlaceholder(`${week}${getSuffix(week)} ${dayMap[weekDay]}`)
        } else if (day) {
            setPlaceholder(`${day}${getSuffix(day)}`)
        }
    }, [day, month, week, weekDay])

    return (
        <>
            <div
                onClick={() => setOpen(!open)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        setOpen(!open)
                    }
                }}
                ref={buttonRef}
                tabIndex={0}
                role="button"
                name="schedule-dropdown"
                id="schedule-dropdown-button"
                aria-label="Open schedule dropdown"
                aria-haspopup="true"
                aria-expanded={`${open}`}
                aria-controls="schedule-dropdown"
                {...props}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <Calendar
                        width={'1.5em'}
                        height={'1.5em'}
                        fill={
                            placeholder
                                ? 'var(--m-text-gray)'
                                : 'var(--input-placeholder2)'
                        }
                    />
                    <span style={{
                        opacity: placeholder ? '1' : '.4',
                        margin: '0 8px',
                    }}>
                        {placeholder || 'Schedule'}
                    </span>
                </div>
                <Arrow
                    width={'.8em'}
                    height={'.8em'}
                    stroke={
                        placeholder
                            ? 'var(--m-text-gray)'
                            : 'var(--input-placeholder2)'
                    }
                />
                {children}
            </div>
        </>

    )
}

const ModeSelector = ({ mode, setMode }) => {
    const options = [
        { label: 'Day', value: 'day', default: true },
        { label: 'Week', value: 'week', default: false },
    ]

    return (
        <Radios
            value={mode}
            onChange={setMode}
            style={{
                borderRadius: 'var(--border-radius2)',
                backgroundColor: 'var(--input-color)',
                display: 'inline-block',
            }}
        >
            <Radios.Pill styles={{
                backgroundColor: 'var(--btn-gray)',
                borderRadius: 'var(--border-radius2)'
            }} />
            {options.map((option) => (
                <Radios.Input
                    key={option.value}
                    option={option}
                    style={{
                        padding: '0px 12px',
                        cursor: 'pointer'
                    }}
                >
                    {({ selected }) => (
                        <span
                            style={{
                                color: selected
                                    ? 'var(--white-text)'
                                    : 'var(--input-placeholder2)',
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

const DayPicker = () => {
    const daysMap = {
        1: 31, 2: 28, 3: 31, 4: 30,
        5: 31, 6: 30, 7: 31, 8: 31,
        9: 30, 10: 31, 11: 30, 12: 31,
    } // How many days are in each month

    const { setOpen, day, setDay, month } = useContext(pickerContext)
    const [numberOfDays, setNumberOfDays] = useState(daysMap[month || 1])
    const [activeDay, setActiveDay] = useState(null)
    const ref = useRef(null)

    const Day = ({ dayNumber }) => (
        <td key={dayNumber}>
            <div
                className={`day picker-item
                    ${day === dayNumber ? 'selected' : 'unselected'}
                    ${activeDay === dayNumber ? 'active' : ''}
                    `}
                onClick={() => setDay(dayNumber)}
                role="button"
                aria-label={`Select day ${dayNumber + 1}`}
                aria-pressed={`${day === dayNumber}`}
                aria-selected={`${day === dayNumber}`}
                tabIndex={-1}
            >
                {dayNumber}
            </div>
        </td>
    )

    const Row = ({ number }) => (
        <tr>
            {
                Array.from({ length: 7 }, (_, i) =>
                    <Day key={i} dayNumber={i + 1 + (7 * number)} />
                )
            }
        </tr>
    )

    const PartialRow = () => (
        <tr>
            {
                Array.from({ length: numberOfDays - 28 }, (_, i) =>
                    <Day key={i + 29} dayNumber={i + 29} />
                )
            }
        </tr>
    )

    const handleKeyDown = (event) => {
        if (event.shiftKey || event.altKey || event.ctrlKey) {
            return
        }
        switch (event.key) {
            case 'ArrowRight':
                setActiveDay(activeDay < numberOfDays ? activeDay + 1 : 1)
                break
            case 'ArrowLeft':
                setActiveDay(activeDay > 1 ? activeDay - 1 : numberOfDays)
                break
            case 'ArrowUp':
                if (activeDay <= (numberOfDays - 28)) {
                    setActiveDay(activeDay + 28)
                } else if (activeDay >= (numberOfDays - 28) && activeDay <= 7) {
                    setActiveDay(activeDay + 21)
                } else {
                    setActiveDay(activeDay ? activeDay - 7 : numberOfDays)
                }
                break
            case 'ArrowDown':
                if (activeDay > 28) {
                    setActiveDay(activeDay - 28)
                } else if (activeDay > (numberOfDays - 7)) {
                    setActiveDay(activeDay - 21)
                } else {
                    setActiveDay(activeDay ? activeDay + 7 : 1)
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
                setActiveDay(null)
            }}
            onMouseEnter={() => setActiveDay(null)}
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
    } = useContext(pickerContext)

    const [activeWeekNumber, setActiveWeekNumber] = useState(null)
    const [activeWeekDay, setActiveWeekDay] = useState(null)
    const ref = useRef(null)

    useEffect(() => {
        ref.current?.focus()
    }, [])

    const formatWeek = (weekNumber) => {
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

    const formatWeekDay = (weekDayNumber) => {
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

    const WeekNumber = ({ week }) => (
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

    const WeekDay = ({ dayNumber }) => (
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

    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowRight':
                if (activeWeekNumber) {
                    setActiveWeekNumber(activeWeekNumber < 5 ? activeWeekNumber + 1 : 1)
                } else if (activeWeekDay) {
                    setActiveWeekDay(activeWeekDay < 7 ? activeWeekDay + 1 : 1)
                } else {
                    setActiveWeekNumber(1)
                }
                break
            case 'ArrowLeft':
                if (activeWeekNumber) {
                    setActiveWeekNumber(activeWeekNumber > 1 ? activeWeekNumber - 1 : 5)
                } else if (activeWeekDay) {
                    setActiveWeekDay(activeWeekDay > 1 ? activeWeekDay - 1 : 7)
                } else {

                }
                break
            case 'ArrowUp':
                if (activeWeekDay) {
                    setActiveWeekNumber(Math.min(5, activeWeekDay))
                    setActiveWeekDay(null)
                }
                break
            case 'ArrowDown':
                if (activeWeekNumber) {
                    setActiveWeekDay(activeWeekNumber)
                    setActiveWeekNumber(null)
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
                setActiveWeekDay(null)
                setActiveWeekNumber(null)
            }}
            onMouseEnter={() => {
                setActiveWeekDay(null)
                setActiveWeekNumber(null)
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
                        <WeekNumber key={i + 1} week={i + 1} />
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
                        <WeekDay key={i + 1} dayNumber={i + 1} />
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
    } = useContext(pickerContext)

    const ref = useRef(null)
    const [mode, setMode] = useState('day')

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
            setWeek('')
            setWeekDay('')
            setOpen(false)
        }
    }, [day])

    // Clear other inputs different mode's
    // inputs are entered
    useEffect(() => {
        if (week || weekDay) {
            setDay('')
        }
        if (week && weekDay) {
            setOpen(false)
        }
    }, [weekDay, week])

    return (
        <>
            {mode === 'day' &&
                (day && <input type="hidden" name="day" value={day} />)
            }
            {mode === 'week' &&
                (weekDay && <input type="hidden" name="weekDay" value={weekDay} />)
            }
            {mode === 'week' &&
                (week && <input type="hidden" name="week" value={week} />)
            }
            <DropAnimation
                visible={open}
                className="dropdown"
                id="schedule-dropdown"
                style={{ marginTop: '4px' }}
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
            </DropAnimation>
        </>
    )
}

const MonthPicker = () => {
    const { month, setMonth, setOpen } = useContext(pickerContext)

    const [activeMonth, setActiveMonth] = useState(null)
    const ref = useRef(null)

    const translateMonthNumber = (monthNumber) => {
        // Lookup table
        const months = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
            5: 'May', 6: 'June', 7: 'Jul', 8: 'Aug',
            9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
        }
        return months[monthNumber]
    }

    const Month = ({ monthNumber }) => (
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

    const handleKeyDown = (event) => {
        const key = event.key
        const actions = {
            ArrowRight: () => {
                setActiveMonth(activeMonth < 12 ? activeMonth + 1 : 1)
            },
            ArrowLeft: () => {
                setActiveMonth(activeMonth > 1 ? activeMonth - 1 : 12)
            },
            ArrowUp: () => {
                setActiveMonth(activeMonth > 6 ? activeMonth - 6 : activeMonth)
            },
            ArrowDown: () => {
                setActiveMonth(activeMonth < 6 ? activeMonth + 6 : activeMonth)
            },
            Enter: () => {
                setMonth(activeMonth)
            },
            Tab: () => {
                setActiveMonth(null)
            },
            Escape: () => {
                setOpen(false)
            },
            default: () => { }
        }
        return (actions[key] || actions['default'])()
    }

    useEffect(() => {
        ref.current?.focus()
    }, [])

    return (
        <div
            id="month-picker2-container"
            ref={ref}
            onBlur={() => {
                setActiveMonth(null)
            }}
            onMouseEnter={() => {
                setActiveMonth(null)
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
                        <Month key={i + 1} monthNumber={i + 1} />
                    )}
                </div>
                <div>
                    {Array.from({ length: 6 }, (_, i) =>
                        <Month key={i + 7} monthNumber={i + 7} />
                    )}
                </div>
            </ul>
        </div>
    )
}

const MonthDayPicker = () => {
    const { open, setOpen, buttonRef, month, day } = useContext(pickerContext)

    const ref = useRef(null)

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
            {month && <input type="hidden" name="month" value={month} />}
            {day && <input type="hidden" name="day" value={day} />}
            <DropAnimation
                visible={open}
                className="dropdown"
                id="schedule-dropdown"
                style={{ marginTop: '4px' }}
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
                    <hr style={{ opacity: '.1', width: '100%' }} />
                    <DayPicker />
                </div>
            </DropAnimation>
        </>
    )
}

Scheduler.Button = Button
Scheduler.DayWeekPicker = DayWeekPicker
Scheduler.MonthDayPicker = MonthDayPicker

export default Scheduler
