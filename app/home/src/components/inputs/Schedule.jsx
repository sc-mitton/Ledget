import React, { useState } from 'react'

import './styles/Dropdowns.css'
import ComboSelect from './ComboSelect'
import { DropAnimation } from '@utils'
import { TextInput } from './Text'
import Arrow from '@assets/icons/Arrow'


const PeriodOptions = ({ schedulePeriods }) => {

    return (
        schedulePeriods.map((option) => (
            <ComboSelect.Option
                value={option.value}
                key={option.value}
                disabled={option.disabled}
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

const PeriodSelector = (props) => {
    const {
        periodSelection,
        setPeriodSelection,
        schedulePeriods,
    } = props

    return (
        <div>
            <ComboSelect
                name="schedule-period"
                value={periodSelection}
                onChange={setPeriodSelection}
            >
                {({ open }) => (
                    <>
                        <ComboSelect.Button
                            className="btn-icon-r"
                            style={{ fontWeight: 500 }}
                        >
                            Schedule
                            <Arrow
                                width={'.8em'}
                                height={'.8em'}
                            />
                        </ComboSelect.Button>
                        <ComboSelect.Options className="select-container" static >
                            <DropAnimation visible={open} className="dropdown select" >
                                <PeriodOptions schedulePeriods={schedulePeriods} />
                            </DropAnimation>
                        </ComboSelect.Options>
                    </>
                )}
            </ComboSelect>
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

const WeekSelector = () => {
    const [weekSelection, setWeekSelection] = useState('')
    const [weekOptions, setWeekOptions] = useState([
        { label: '1st', value: '1', disabled: false },
        { label: '2nd', value: '2', disabled: false },
        { label: '3rd', value: '3', disabled: false },
        { label: '4th', value: '4', disabled: false },
        { label: 'Last', value: '-1', disabled: false },
    ])

    return (
        <ComboSelect
            name="schedule-week"
            value={weekSelection}
            onChange={setWeekSelection}
        >
            {({ open }) => (
                <>
                    <ComboSelect.Button className="btn-icon-r btn-rnd" >
                        <TextInput style={{ margin: '0' }}>
                            <span style={{ opacity: weekSelection ? '1' : '.5' }}>
                                {weekSelection
                                    ? `${weekOptions.find((week) => week.value === weekSelection).label}`
                                    : 'Week'}
                            </span>
                            <Arrow
                                width={'.8em'}
                                height={'.8em'}
                                stroke={weekSelection ? 'var(--main-text-gray)' : 'var(--input-placeholder2)'}
                            />
                        </TextInput>
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

const WeekdaySelector = () => {
    const [days, setDays] = useState([
        { label: 'Monday', value: 'mon', disabled: false },
        { label: 'Tuesday', value: 'tue', disabled: false },
        { label: 'Wednesday', value: 'wed', disabled: false },
        { label: 'Thursday', value: 'thu', disabled: false },
        { label: 'Friday', value: 'fri', disabled: false },
        { label: 'Saturday', value: 'sat', disabled: false },
        { label: 'Sunday', value: 'sun', disabled: false },
    ])
    const [daySelection, setDaySelection] = useState('')

    return (
        <ComboSelect
            name="schedule-day"
            value={daySelection}
            onChange={setDaySelection}
        >
            {({ open }) => (
                <>
                    <ComboSelect.Button className="btn-icon-r btn-rnd" >
                        <TextInput style={{ margin: '0' }}>
                            <span style={{ opacity: daySelection ? '1' : '.5' }}>
                                {daySelection
                                    ? `${days.find((day) => day.value === daySelection).label}`
                                    : 'Day'}
                            </span>
                            <Arrow
                                width={'.8em'}
                                height={'.8em'}
                                stroke={daySelection.length > 0 ? 'var(--main-text-gray)' : 'var(--input-placeholder2)'}
                            />
                        </TextInput>
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

const Schedule = () => {
    const [schedulePeriods, setSchedulePeriods] = useState([
        { label: 'Day of the month', value: 'day', disabled: false },
        { label: 'Day of the week', value: 'week', disabled: false },
    ])
    const [periodSelection, setPeriodSelection] = useState('')

    return (
        <div id="shedule-inputs">
            <div id="schedule-header">
                <PeriodSelector
                    periodSelection={periodSelection}
                    setPeriodSelection={setPeriodSelection}
                    schedulePeriods={schedulePeriods}
                />
            </div>
            <div id="schedule-input-container">
                <div style={{ flex: '1', marginRight: '8px' }}>
                    <WeekSelector />
                </div>
                <div style={{ flex: '1' }}>
                    <WeekdaySelector />
                </div>
            </div>
        </div>
    )
}

export default Schedule
