import React, { useState } from 'react'

import './styles/Dropdowns.css'
import ComboSelect from './ComboSelect'
import { DropAnimation } from '@utils'
import Plus from '@assets/icons/Plus'
import Checkmark from '@assets/icons/Checkmark'

const defaultOptions = [
    { id: 1, value: { quantity: 1, period: 'day' }, disabled: false },
    { id: 2, value: { quantity: 3, period: 'day' }, disabled: false },
    { id: 3, value: { quantity: 5, period: 'day' }, disabled: false },
    { id: 4, value: { quantity: 1, period: 'week' }, disabled: false },
    { id: 4, value: { quantity: 2, period: 'week' }, disabled: false }
]

const AddReminder = () => {
    const [selectedReminders, setSelectedReminders] = useState([])
    const [reminderOptions, setReminderOptions] = useState(defaultOptions)


    const Option = ({ value, active, selected }) => (
        <div className={`slct-item ${active && "a-slct-item"} ${selected && "s-slct-item"}`}>
            <div>
                {value.quantity}
                {value.quantity > 1 ? ` ${value.period}s` : ` ${value.period}}`}
            </div>
            <div>
                <Checkmark
                    stroke={`${selected ? 'var(--green-dark)' : 'transparent'}`}
                />
            </div>
        </div>
    )

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
        <ComboSelect
            name="reminders"
            value={selectedReminders}
            onChange={setReminderOptions}
            multiple
        >
            {({ open }) => (
                <>
                    <ComboSelect.Button className="btn-chcl btn-2slim btn">
                        Reminder
                        {selectedReminders.length > 0
                            ?
                            <Checkmark
                                stroke={'var(--white-text)'}
                                width={'.7em'}
                                height={'.7em'}
                            /> :
                            <Plus
                                stroke={'var(--white-text)'}
                                strokeWidth={'20'}
                                width={'.8em'}
                                height={'.8em'}
                            />}
                    </ComboSelect.Button>
                    <ComboSelect.Options style={{ position: 'absolute', }} static>
                        <DropAnimation open={open} className="dropdown select">
                            <Options />
                        </DropAnimation>
                    </ComboSelect.Options>
                </>
            )}
        </ComboSelect>
    )
}

export default AddReminder
