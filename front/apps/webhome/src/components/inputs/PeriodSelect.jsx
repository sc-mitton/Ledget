import { useState, useRef, useEffect } from 'react'

import ComboSelect from './ComboSelect'
import { SlimInputButton, DropAnimation } from '@ledget/ui'
import { ArrowIcon } from '@ledget/media'

const opts = [
    { id: 1, value: 'month', label: 'Monthly', default: true },
    { id: 2, value: 'year', label: 'Yearly' }
]

const PeriodSelect = (props) => {
    const { hasLabel, labelPrefix, value: propsValue, onChange, default: defaultValue } = props

    const [value, setValue] = useState()
    const buttonRef = useRef(null)

    const localSetValue = onChange || setValue
    const localValue = propsValue || value

    useEffect(() => {
        if (defaultValue) {
            const val = opts.find((option) => option.value === defaultValue).value
            if (val) {
                setValue(val)
                return
            }
        }

        setValue(opts.find((option) => option.default).value)
    }, [])

    const Options = () => (
        opts.map((option) => (
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
            {hasLabel &&
                <label htmlFor="period">Refreshes</label>
            }
            <ComboSelect
                name="period"
                value={localValue}
                onChange={localSetValue}
                defaultValue={opts.find((option) => option.default).value}
            >
                {({ open }) => (
                    <>
                        <ComboSelect.Button
                            as={SlimInputButton}
                            id="period-select-btn"
                            style={{
                                color: 'var(--m-text-gray)',
                                marginTop: hasLabel ? '6px' : '0px'
                            }}
                            ref={buttonRef}
                        >
                            {labelPrefix && `${labelPrefix} `}
                            {labelPrefix
                                ? `${opts.find((option) => option.value === localValue)?.label.charAt(0).toLowerCase()}` +
                                `${opts.find((option) => option.value === localValue)?.label.slice(1)}`
                                : `${opts.find((option) => option.value === localValue)?.label}`
                            }
                            {<ArrowIcon
                                width={'.8em'}
                                height={'.8em'}
                                stroke={`var(--m-text-gray)`}
                            />}
                        </ComboSelect.Button>
                        <ComboSelect.Options className="select-container" static>
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
