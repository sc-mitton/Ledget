import React, { useState, useRef } from 'react'

import './styles/Dropdowns.css'
import './styles/Schedule.css'
import { DropAnimation } from '@utils'
import ComboSelect from './ComboSelect'
import Radios from './Radios'
import Arrow from '@assets/icons/Arrow'
import Calendar from '@assets/icons/Calendar'
import { useEffect } from 'react'
import { useClickClose } from '@utils'


const Button = React.forwardRef((props, ref) => {
    const { onClick, ...rest } = props

    return (
        <>
            <div
                onClick={() => onClick()}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        onClick()
                    }
                }}
                ref={ref}
                tabIndex={0}
                role="button"
                name="schedule-dropdown"
                id="schedule-dropdown-button"
                aria-label="Open schedule dropdown"
                aria-haspopup="true"
                aria-expanded={`${open}`}
                aria-controls="schedule-dropdown"
                {...rest}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Calendar
                        width={'1.5em'}
                        height={'1.5em'}
                        fill={'var(--input-placeholder2)'}
                    />
                    <span style={{ opacity: '.4', marginLeft: '12px', marginTop: "2px" }}>
                        Schedule
                    </span>
                </div>
                <Arrow
                    width={'.8em'}
                    height={'.8em'}
                    stroke={'var(--input-placeholder2)'}
                />
            </div>
        </>

    )
})

const ModeSelector = ({ mode, setMode }) => {
    const options = [
        { label: 'Day', value: 'day', default: true },
        { label: 'Week', value: 'week', default: false },
    ]

    return (
        <Radios
            value={mode}
            onChange={setMode}
            style={{ borderRadius: '12px', padding: '4px 2px' }}
        >
            <Radios.Pill styles={{
                backgroundColor: 'var(--btn-gray)',
                borderRadius: '8px'
            }} />
            {options.map((option) => (
                <Radios.Input
                    key={option.value}
                    option={option}
                    style={{
                        padding: '0px 8px',
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

const DayPicker = ({ day, setDay, setOpen, numberOfDays }) => {
    const ref = useRef(null)
    const [activeDay, setActiveDay] = useState(null)

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

const WeekPicker = (props) => {
    const { weekNumber, setWeekNumber, weekDay, setWeekDay, setOpen } = props
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
                setWeekNumber(activeWeekNumber)
                setWeekDay(activeWeekDay)
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
                    opacity: '.1',
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

const DayWeekPicker = (props) => {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState('')
    const ref = useRef(null)
    const buttonRef = useRef(null)

    const [day, setDay] = useState('')
    const [weekNumber, setWeekNumber] = useState('')
    const [weekDay, setWeekDay] = useState('')

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
            setWeekNumber('')
            setWeekDay('')
        }
    }, [day])

    // Clear other inputs different mode's
    // inputs are entered
    useEffect(() => {
        if (weekNumber || weekDay) {
            setDay('')
        }
    }, [weekNumber, weekDay])

    return (
        <>
            {mode === 'day' &&
                (day && <input type="hidden" name="day" value={day} />)
            }
            {mode === 'week' &&
                (weekDay && <input type="hidden" name="weekDay" value={weekDay} />)
            }
            {mode === 'week' &&
                (weekNumber && <input type="hidden" name="weekNumber" value={weekNumber} />)
            }
            <Button
                onClick={() => setOpen(!open)}
                onFocus={(e) => {
                    e.stopPropagation()
                    open && setOpen(false)
                }}
                ref={buttonRef}
            />
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
                    {mode === 'day' &&
                        <DayPicker
                            day={day}
                            setDay={setDay}
                            setOpen={setOpen}
                            numberOfDays={31}
                        />
                    }
                    {mode === 'week' && (
                        <WeekPicker
                            weekNumber={weekNumber}
                            setWeekNumber={setWeekNumber}
                            weekDay={weekDay}
                            setWeekDay={setWeekDay}
                            setOpen={setOpen}
                        />
                    )}
                </div>
            </DropAnimation>
        </>
    )
}

const MonthPicker = ({ month, setMonth, setOpen }) => {
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

const MonthYearPicker = (props) => {
    const daysMap = {
        1: 31, 2: 28, 3: 31, 4: 30,
        5: 31, 6: 30, 7: 31, 8: 31,
        9: 30, 10: 31, 11: 30, 12: 31,
    }
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const buttonRef = useRef(null)
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')

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

    return (
        <>
            {month && <input type="hidden" name="month" value={month} />}
            {year && <input type="hidden" name="year" value={year} />}
            <Button
                onClick={() => setOpen(!open)}
                ref={buttonRef}
            />
            <DropAnimation
                visible={open}
                className="dropdown"
                id="schedule-dropdown"
                style={{ marginTop: '4px' }}
            >
                <div
                    id="month-year-picker-container"
                    ref={ref}
                    onKeyDown={(event) => {
                        event.stopPropagation()
                        if (event.key === 'Escape') {
                            setOpen(false)
                        }
                    }}
                >
                    <MonthPicker month={month} setMonth={setMonth} setOpen={setOpen} />
                    <hr style={{ opacity: '.1', width: '100%' }} />
                    <DayPicker
                        day={year}
                        setDay={setYear}
                        setOpen={setOpen}
                        numberOfDays={daysMap[month || 1]}
                    />
                </div>
            </DropAnimation>
        </>
    )
}

export { DayWeekPicker, MonthYearPicker }
