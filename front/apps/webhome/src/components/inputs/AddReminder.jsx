import React, { useState } from 'react'

import './styles/Dropdowns.css'
import ComboSelect from './ComboSelect'
import { DropAnimation } from '@utils'
import { Plus, CheckMark } from '@assets/icons'

const defaultOptions = [
    { id: 1, value: { offset: 1, period: 'day' }, disabled: false },
    { id: 2, value: { offset: 3, period: 'day' }, disabled: false },
    { id: 3, value: { offset: 5, period: 'day' }, disabled: false },
    { id: 4, value: { offset: 1, period: 'week' }, disabled: false },
    { id: 5, value: { offset: 2, period: 'week' }, disabled: false },
    { id: 6, value: { offset: 3, period: 'week' }, disabled: false }
]

const AddReminder = ({ value, onChange }) => {
    const [localSelectedReminders, localSetReminders] = useState([])
    const [reminderOptions, setReminderOptions] = useState(defaultOptions)

    const selectedReminders = value || localSelectedReminders
    const setSelectedReminders = onChange || localSetReminders

    const Option = ({ value, active, selected }) => {
        const opIndex = reminderOptions.findIndex((op) => op.value === value)
        const nextOp = reminderOptions[opIndex + 1]

        return (
            <>
                <div
                    className={`slct-item ${active && "a-slct-item"} ${selected && "s-slct-item"}`}
                >
                    <div>
                        {value.offset}
                        {value.offset > 1 ? ` ${value.period}s` : ` ${value.period}`}
                        <span style={{ opacity: active ? '.5' : '0', padding: '0 8px', fontWeight: '400' }}>before</span>
                    </div>
                    {!selected
                        ? <Plus stroke={'var(--muted-text-gray)'} width={'.9em'} height={'.9em'} />
                        : <CheckMark stroke={`${selected ? 'var(--green-dark)' : 'transparent'}`} />
                    }
                </div>
                <div style={{ padding: '0 8px' }}>
                    {nextOp && nextOp.value.period !== value.period && <hr />}
                </div>
            </>
        )
    }

    const Options = () => {
        return (
            reminderOptions.map((option) => (
                <ComboSelect.Option
                    value={option.value}
                    disabled={option.disabled}
                    key={option.id}
                >
                    {({ active, selected }) => (
                        <Option
                            value={option.value}
                            active={active}
                            selected={selected}
                        />
                    )}
                </ComboSelect.Option>
            ))
        )
    }

    return (
        <div>
            <ComboSelect
                name="reminders"
                value={selectedReminders}
                onChange={setSelectedReminders}
                multiple
            >
                {({ open }) => (
                    <>
                        <ComboSelect.Button
                            className="btn-clr btn-slim btn"
                            id="add-reminder-btn"
                            style={{ fontWeight: '400' }}
                        >
                            Reminder
                            {selectedReminders.length > 0
                                ?
                                <CheckMark
                                    stroke={'var(--m-text-gray)'}
                                    width={'.7em'}
                                    height={'.7em'}
                                /> :
                                <Plus
                                    stroke={'var(--m-text-gray)'}
                                    strokeWidth={'20'}
                                    width={'.8em'}
                                    height={'.8em'}
                                />}
                        </ComboSelect.Button>
                        <ComboSelect.Options className="select-container" static>
                            <DropAnimation visible={open} className="dropdown select">
                                <Options />
                            </DropAnimation>
                        </ComboSelect.Options>
                    </>
                )}
            </ComboSelect>
        </div>
    )
}

export default AddReminder
