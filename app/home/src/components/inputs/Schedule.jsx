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
            <label htmlFor="schedule-dropdown">
                Schedule
            </label>
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
                <Calendar
                    width={'1.5em'}
                    height={'1.5em'}
                    fill={'var(--input-placeholder2)'}
                />
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
            <Radios.Pill styles={{ backgroundColor: 'var(--btn-gray)' }} />
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

const DayPicker = ({ day, setDay, setOpen }) => {
    const ref = useRef(null)
    const [activeDay, setActiveDay] = useState(null)
    const [focused, setFocused] = useState(false)

    const Day = ({ dayNumber }) => (
        <td key={dayNumber}>
            <div
                className={`day
                    ${day === dayNumber ? 'selected-day' : ''}
                    ${activeDay === dayNumber ? 'active-day' : ''}
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
                Array.from({ length: 3 }, (_, i) =>
                    <Day key={i + 29} dayNumber={i + 29} />
                )
            }
        </tr>
    )

    const handleKeyDown = (event) => {
        if (!focused || event.shiftKey || event.altKey || event.ctrlKey) {
            return
        }

        switch (event.key) {
            case 'ArrowRight':
                setActiveDay(activeDay < 31 ? activeDay + 1 : 1)
                break
            case 'ArrowLeft':
                setActiveDay(activeDay > 1 ? activeDay - 1 : 31)
                break
            case 'ArrowUp':
                if (activeDay < 4 && activeDay > 0) {
                    setActiveDay(activeDay + 28)
                } else if (activeDay >= 4 && activeDay <= 7) {
                    setActiveDay(activeDay + 21)
                } else {
                    setActiveDay(activeDay ? activeDay - 7 : 31)
                }
                break
            case 'ArrowDown':
                if (activeDay > 28 && activeDay < 32) {
                    setActiveDay(activeDay - 28)
                } else if (activeDay >= 25 && activeDay <= 28) {
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
                setFocused(false)
            }}
            onMouseEnter={() => setActiveDay(null)}
            onKeyDown={(event) => handleKeyDown(event)}
            onFocus={() => setFocused(true)}
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
    const { week, setWeek, weekDay, setWeekDay, setOpen } = props
    const [activeWeekNumber, setActiveWeekNumber] = useState(null)
    const [activeWeekDay, setActiveWeekDay] = useState(null)
    const ref = useRef(null)

    useEffect(() => {
        ref.current?.focus()
    }, [])

    const formatWeek = (weekNumber) => {
        switch (weekNumber) {
            case 1:
                return `${weekNumber}st`
            case 2:
                return `${weekNumber}nd`
            case 3:
                return `${weekNumber}rd`
            default:
                return `${weekNumber}th`
        }
    }

    const formatWeekDay = (weekDayNumber) => {
        switch (weekDayNumber) {
            case 0:
                return 'Sunday'
            case 1:
                return 'Monday'
            case 2:
                return 'Tuesday'
            case 3:
                return 'Wednesday'
            case 4:
                return 'Thursday'
            case 5:
                return 'Friday'
            case 6:
                return 'Saturday'
            default:
                return ''
        }
    }

    const WeekNumber = ({ weekNumber }) => (
        <li>
            <div
                className={`week-number
                    ${week === weekNumber ? 'selected-week-number' : ''}
                    `}
                onClick={() => setWeek(weekNumber)}
                role="button"
                aria-label={`Select week ${weekNumber + 1}`}
                aria-pressed={`${week === weekNumber}`}
                aria-selected={`${week === weekNumber}`}
                tabIndex={-1}
            >
                {formatWeek(weekNumber)}
            </div>
        </li>
    )

    const WeekDay = ({ dayNumber }) => (
        <li>
            <div
                className={`week-day
                    ${weekDay === dayNumber ? 'selected-week-day' : ''}
                    `}
                onClick={() => setWeekDay(dayNumber)}
                role="button"
                aria-label={`Select day ${dayNumber + 1}`}
                aria-pressed={`${weekDay === dayNumber}`}
                aria-selected={`${weekDay === dayNumber}`}
                tabIndex={-1}
            >
                {formatWeekDay(dayNumber)}
            </div>
        </li>
    )

    return (
        <div
            className="week-picker"
            ref={ref}
            onBlur={() => {
                setActiveDay(null)
                setFocused(false)
            }}
            onMouseEnter={() => {
                setActiveWeekDay(null)
                setActiveWeekNumber(null)
            }}
            onKeyDown={(event) => handleKeyDown(event)}
            onFocus={() => setFocused(true)}
            tabIndex={0}
        >
            <ul className="week-picker">
                {
                    Array.from({ length: 4 }, (_, i) =>
                        <Week key={i} weekNumber={i + 1} />
                    )
                }
            </ul>
            <ul className="week-day-picker">
                {
                    Array.from({ length: 7 }, (_, i) =>
                        <WeekDay key={i} dayNumber={i} />
                    )
                }
            </ul>
        </div>
    )
}

const ScheduleSelector = (props) => {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState('')
    const ref = useRef(null)
    const buttonRef = useRef(null)

    const [day, setDay] = useState('')
    const [week, setWeek] = useState('')
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
            setWeek('')
            setWeekDay('')
        }
    }, [day])

    // Clear other inputs different mode's
    // inputs are entered
    useEffect(() => {
        if (week || weekDay) {
            setDay('')
        }
    }, [week, weekDay])

    return (
        <>
            {mode === 'day' &&
                (day && <input type="hidden" name="day" value={day} />)
            }
            {mode === 'week' &&
                (weekDay && <input type="hidden" name="weekDay" value={weekDay} />)
            }
            {mode === 'week' &&
                (week && <input type="hidden" name="day" value={day} />)
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
                        />
                    }
                    {mode === 'week' && (
                        <WeekPicker
                            week={week}
                            setWeek={setWeek}
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

const DatePicker = (props) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const buttonRef = useRef(null)

    useClickClose({
        refs: [ref, buttonRef],
        visible: open,
        setVisible: setOpen
    })

    return (
        <>
            <Button
                onClick={() => setOpen(!open)}
                ref={buttonRef}
            />
            <DropAnimation
                visible={open}
                className="dropdown"
                id="schedule-dropdown"
            >
                <div ref={ref}>

                </div>
            </DropAnimation>
        </>
    )
}

export default ScheduleSelector
