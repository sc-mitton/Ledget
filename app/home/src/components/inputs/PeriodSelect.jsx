import React, { useEffect, useState, useRef } from 'react'

import Arrow from '@assets/icons/Arrow'
import ComboSelect from './ComboSelect'
import { DropAnimation } from '@utils'

const options = [
    { id: 1, value: 'month', label: 'Month', default: true },
    { id: 2, value: 'year', label: 'Year' }
]

const PeriodSelect = () => {
    const [value, setValue] = useState(options.find((option) => option.default).value)
    const buttonRef = useRef(null)

    const Options = () => (
        options.map((option) => (
            <ComboSelect.Option
                key={option.id}
                value={option.value}
                disabled={option.disabled}
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
            <label htmlFor="period">Type</label>
            <ComboSelect name="period" value={value} onChange={setValue}>
                {({ open }) => (
                    <>
                        <ComboSelect.Button
                            className="btn-input"
                            id="period-select-btn"
                            style={{ color: 'var(--m-text-gray)' }}
                            ref={buttonRef}
                        >
                            {options.find((option) => option.value === value).label}
                            {
                                <Arrow
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
