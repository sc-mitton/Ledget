import React, { useState, useRef } from 'react'

import ComboSelect from './ComboSelect'
import { SlimInputButton, DropAnimation } from '@ledget/shared-ui'
import { ArrowIcon } from '@ledget/shared-assets'

const options = [
    { id: 1, value: 'month', label: 'Monthly', default: true },
    { id: 2, value: 'year', label: 'Yearly' }
]

const PeriodSelect = (props) => {
    const [value, setValue] = useState()
    const buttonRef = useRef(null)

    const localSetValue = props.onChange || setValue
    const localValue = props.value || value

    const Options = () => (
        options.map((option) => (
            <ComboSelect.Option
                key={option.id}
                value={option.value}
                disabled={option.disabled}
                isDefault={option.default}
            >
                {({ active, selected }) => (
                    <div
                        className={
                            `slct-item ${active && "a-slct-item"}
                            ${selected && "s-slct-item"}`}
                        style={{ paddingRight: '34px' }}
                    >
                        {option.label}
                    </div>
                )}
            </ComboSelect.Option>
        ))
    )

    return (
        <>
            <ComboSelect
                name="period"
                value={localValue}
                onChange={localSetValue}
                defaultValue={options.find((option) => option.default).value}
            >
                {({ open }) => (
                    <>
                        <ComboSelect.Button
                            as={SlimInputButton}
                            id="period-select-btn"
                            style={{ color: 'var(--m-text-gray)' }}
                            ref={buttonRef}
                        >
                            {options.find((option) => option.value === localValue)?.label}
                            {
                                <ArrowIcon
                                    width={'.8em'}
                                    height={'.8em'}
                                    stroke={`var(--m-text-gray)`}
                                />
                            }
                        </ComboSelect.Button>
                        <ComboSelect.Options
                            className="select-container"
                            static
                        >
                            <DropAnimation
                                className="dropdown select"
                                visible={open}
                                style={{
                                    minWidth: `${buttonRef?.current?.offsetWidth}px`,
                                }}
                            >
                                <Options />
                            </DropAnimation>
                        </ComboSelect.Options>
                    </>
                )}
            </ComboSelect>
        </>
    )
}

export default PeriodSelect
