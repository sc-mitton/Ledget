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

const DayPicker = ({ day, setDay, setOpen }) => {
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
                Array.from({ length: 3 }, (_, i) =>
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

const ScheduleSelector = (props) => {
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
            <div style={{ position: 'relative' }}>
                <DropAnimation
                    visible={open}
                    className="dropdown"
                    id="schedule-dropdown"
                    style={{
                        left: '-120%',
                        top: '4px',
                    }}
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
                                weekNumber={weekNumber}
                                setWeekNumber={setWeekNumber}
                                weekDay={weekDay}
                                setWeekDay={setWeekDay}
                                setOpen={setOpen}
                            />
                        )}
                    </div>
                </DropAnimation>
            </div>
        </>
    )
}

const DatePicker = (props) => {
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
            <Button
                onClick={() => setOpen(!open)}
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

                </div>
            </DropAnimation>
        </>
    )
}

export default ScheduleSelector
