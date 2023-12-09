import React, { useState, Dispatch, SetStateAction, useEffect } from 'react'

import './styles/Dropdowns.css'
import { Listbox } from '@headlessui/react'
import { Plus, CheckMark } from '@ledget/media'
import { SlimInputButton, DropAnimation } from '@ledget/ui'
import { useGetRemindersQuery, Reminder } from '@features/remindersSlice'


const AddReminder = ({ value, onChange, defaultSelected }:
    { value?: Reminder[], defaultSelected?: string[], onChange?: Dispatch<SetStateAction<Reminder[] | undefined>> }) => {
    const [localSelectedReminders, localSetReminders] = useState<Reminder[]>([])
    const [reminderOptions, setReminderOptions] = useState<Reminder[]>([])
    const { data: reminders, isSuccess } = useGetRemindersQuery()

    useEffect(() => {
        isSuccess && setReminderOptions(reminders)
    }, [isSuccess])

    const selectedReminders = value || localSelectedReminders
    const setSelectedReminders = onChange || localSetReminders

    const Option = ({ value, active, selected }: { value: Reminder, active: boolean, selected: boolean }) => {
        const opIndex = reminderOptions.findIndex((op) => op === value)
        const nextOp = reminderOptions[opIndex + 1]

        return (
            <>
                <div
                    className={`slct-item ${active && "a-slct-item"} ${selected && "s-slct-item"}`}
                >
                    <div>
                        {value.offset}
                        {value.offset > 1 ? ` ${value.period}s` : ` ${value.period}`}
                        <span style={{ opacity: active ? '.5' : '0', padding: '0 .5em', fontWeight: '400' }}>before</span>
                    </div>
                    {!selected
                        ? <Plus stroke={'currentColor'} size={'.8em'} />
                        : <CheckMark stroke={`${selected ? 'var(--main-dark)' : 'transparent'}`} />
                    }
                </div>
                <div style={{ padding: '0 .5em' }}>
                    {nextOp && nextOp.period !== value.period && <hr />}
                </div>
            </>
        )
    }

    const Options = () => {
        return (
            reminderOptions.map((option) => (
                <Listbox.Option
                    value={option}
                    disabled={!option.active}
                    key={option.id}
                >
                    {({ active, selected }) => (
                        <Option
                            value={option}
                            active={active}
                            selected={selected}
                        />
                    )}
                </Listbox.Option>
            ))
        )
    }

    return (
        <div>
            <Listbox
                name="reminders"
                value={selectedReminders}
                onChange={setSelectedReminders as React.Dispatch<React.SetStateAction<Reminder[]>>}
                multiple
            >
                {({ open }) => (
                    <>
                        <Listbox.Button
                            as={SlimInputButton}
                            id="add-reminder-btn"
                            style={{ fontWeight: '400' }}
                        >
                            <span>Reminder</span>
                            {selectedReminders.length > 0
                                ?
                                <CheckMark
                                    stroke={'currentColor'}
                                    size={'.7em'}
                                /> :
                                <Plus
                                    stroke={'currentColor'}
                                    strokeWidth={'20'}
                                    size={".8em"}
                                />}
                        </Listbox.Button>
                        <Listbox.Options className="select-container" static>
                            <DropAnimation
                                placement='left'
                                visible={open}
                                className="dropdown select"
                            >
                                <Options />
                            </DropAnimation>
                        </Listbox.Options>
                    </>
                )}
            </Listbox>
        </div>
    )
}

export default AddReminder
