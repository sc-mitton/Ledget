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
    const { onClick } = props

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
            >
                <Calendar
                    width={'1.7em'}
                    height={'1.7em'}
                    fill={'var(--input-placeholder2)'}
                />
                <Arrow
                    width={'.9em'}
                    height={'.9em'}
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
                                    : 'var(--input-placeholder2)'
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
                    ${day === dayNumber ? 'selected' : ''}
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

const WeekOptions = ({ weekOptions }) => {
    return (
        weekOptions.map((option) => (
            <ComboSelect.Option
                value={option.value}
                disabled={option.disabled}
                key={option.value}
            >
                {({ active, selected }) => (
                    <div className={
                        `slct-item ${active && "a-slct-item"}
                    ${selected && "s-slct-item"}`}
                    >
                        <div>{option.label}</div>
                    </div>
                )}
            </ComboSelect.Option>
        ))
    )
}

const WeekSelector = ({ value, onChange }) => {
    const [weekOptions, setWeekOptions] = useState([
        { label: 'First', value: '1', disabled: false },
        { label: 'Second', value: '2', disabled: false },
        { label: 'Third', value: '3', disabled: false },
        { label: 'Fourth', value: '4', disabled: false },
        { label: 'Last', value: '-1', disabled: false },
    ])

    return (
        <ComboSelect
            name="schedule-week"
            value={value}
            onChange={onChange}
        >
            {({ open }) => (
                <>
                    <ComboSelect.Button
                        className="btn-icon-r btn-rnd btn-pill"
                        style={{ marginRight: '12px' }}
                    >
                        <span style={{ opacity: value ? '1' : '.5' }}>
                            {value
                                ? `${weekOptions.find((week) => week.value === value).label}`
                                : 'Week'}
                        </span>
                        <Arrow
                            width={'.8em'}
                            height={'.8em'}
                            stroke={value
                                ? 'var(--main-text-gray)'
                                : 'var(--input-placeholder2)'
                            }
                        />
                    </ComboSelect.Button>
                    <ComboSelect.Options className="select-container" static >
                        <DropAnimation visible={open} className="dropdown select" >
                            <WeekOptions weekOptions={weekOptions} />
                        </DropAnimation>
                    </ComboSelect.Options>
                </>
            )}
        </ComboSelect>
    )
}

const WeekdayOptions = ({ days }) => {
    return (
        days.map((option) => (
            <ComboSelect.Option
                value={option.value}
                disabled={option.disabled}
                key={option.value}
            >
                {({ active, selected }) => (
                    <div className={
                        `slct-item ${active && "a-slct-item"}
                    ${selected && "s-slct-item"}`}
                    >
                        <div>{option.label}</div>
                    </div>
                )}
            </ComboSelect.Option>
        ))
    )
}

const WeekdaySelector = ({ value, onChange }) => {
    const [days, setDays] = useState([
        { label: 'Monday', value: 'mon', disabled: false },
        { label: 'Tuesday', value: 'tue', disabled: false },
        { label: 'Wednesday', value: 'wed', disabled: false },
        { label: 'Thursday', value: 'thu', disabled: false },
        { label: 'Friday', value: 'fri', disabled: false },
        { label: 'Saturday', value: 'sat', disabled: false },
        { label: 'Sunday', value: 'sun', disabled: false },
    ])

    return (
        <ComboSelect
            name="schedule-day"
            value={value}
            onChange={onChange}
        >
            {({ open }) => (
                <>
                    <ComboSelect.Button
                        className="btn-icon-r btn-rnd btn-pill"
                    >
                        <span style={{ opacity: value ? '1' : '.5' }}>
                            {value
                                ? `${days.find((day) => day.value === value).label}`
                                : 'Day'}
                        </span>
                        <Arrow
                            width={'.8em'}
                            height={'.8em'}
                            stroke={value.length > 0
                                ? 'var(--main-text-gray)'
                                : 'var(--input-placeholder2)'
                            }
                        />
                    </ComboSelect.Button>
                    <ComboSelect.Options className="select-container" static >
                        <DropAnimation visible={open} className="dropdown select" >
                            <WeekdayOptions days={days} />
                        </DropAnimation>
                    </ComboSelect.Options>
                </>
            )}
        </ComboSelect>
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

    // Clear other inputs different mode's inputs are entered
    useEffect(() => {
        if (day) {
            setWeek('')
            setWeekDay('')
        }
    }, [day])

    // Clear other inputs different mode's inputs are entered
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
                        <div id="week-selectors">
                            <div className="btn-pill">
                                <WeekSelector
                                    value={week}
                                    onChange={setWeek}
                                />
                            </div>
                            <div className="btn-pill">
                                <WeekdaySelector
                                    value={weekDay}
                                    onChange={setWeekDay}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </DropAnimation>
        </>
    )
}

export default ScheduleSelector
