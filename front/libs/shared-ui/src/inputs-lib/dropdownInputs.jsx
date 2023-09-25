import React, { useState, useEffect } from "react";

import './styles/dropdownInputs.css'
import { DropAnimation } from '../animations-lib/animations'
import { Combobox } from '@headlessui/react'
import { states as provences } from '../data/states'
import { TextInput } from "./textInputs";
import { ArrowIcon } from '@ledget/shared-assets'
import { FormErrorTip } from '../pieces-lib/pieces'

export const ProvenceSelect = ({ field, errors }) => {
    const [query, setQuery] = useState('')
    const [focused, setFocused] = useState(false)
    const [provence, setProvence] = useState(null)
    const inputRef = React.useRef(null)

    const filterProvence =
        query === ''
            ? provences
            : provences.filter((provence) => {
                return provence.label.toLowerCase().includes(query.toLowerCase()) ||
                    provence.abbreviation.toLowerCase().includes(query.toLowerCase())
            })

    useEffect(() => {
        field && field.onChange(provence?.value)
    }, [provence])

    return (
        <Combobox value={provence} onChange={setProvence}>
            {({ open }) => (
                <>
                    <TextInput ref={inputRef}>
                        <Combobox.Input
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(provence) => provence?.abbreviation}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            name="state"
                            placeholder="State"
                        />
                        <Combobox.Button
                            style={{
                                opacity: (provence || focused) ? 1 : .5,
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <ArrowIcon
                                width={'.9em'}
                                height={'.9em'}
                                stroke={(focused && !provence) ? 'var(--green-input-focus)' : 'var(--m-text-gray)'}
                            />
                        </Combobox.Button>
                        <FormErrorTip errors={errors} />
                    </TextInput>
                    <div className="provence-options--container">
                        <DropAnimation
                            visible={open}
                            className="provence-options"
                            style={{ minWidth: `${inputRef.current?.offsetWidth}px` }}
                        >
                            <Combobox.Options static>
                                {filterProvence.map((provence) => (
                                    <Combobox.Option key={provence.value} value={provence} as={React.Fragment}>
                                        {({ active, selected }) => (
                                            <li className={`provence ${active ? 'active' : ''} ${selected ? 'selected' : ''}`}>
                                                {provence.label}
                                            </li>
                                        )}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </DropAnimation>
                    </div>
                </>
            )}
        </Combobox>
    )
}
