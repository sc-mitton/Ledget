import { useState, useRef, useEffect } from 'react'

import { Listbox } from '@headlessui/react'
import { SlimInputButton, DropAnimation } from '@ledget/ui'
import { ArrowIcon } from '@ledget/media'

const opts = [
    { id: 1, value: 'month', label: 'Monthly', default: true },
    { id: 2, value: 'year', label: 'Yearly' },
    { id: 3, value: 'once', label: 'Once', disabled: true }
]

const PeriodSelect = (props) => {
    const {
        hasLabel,
        labelPrefix,
        value: propsValue,
        onChange,
        enableAll,
        default: defaultValue
    } = props

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
        opts.filter(op => enableAll || !op.disabled).map((option) => (
            <Listbox.Option
                key={option.id}
                value={option.value}
                disabled={enableAll ? false : option.disabled}
                isDefault={option.default}
            >
                {({ active, selected }) => (
                    <div
                        className={
                            `slct-item ${active && "a-slct-item"}
                            ${selected && "s-slct-item"}`}
                        style={{ paddingRight: '2.125em' }}
                    >
                        {option.label}
                    </div>
                )}
            </Listbox.Option>
        ))
    )

    return (
        <>
            {hasLabel &&
                <label htmlFor="period">Refreshes</label>
            }
            <Listbox
                name="period"
                value={localValue}
                onChange={localSetValue}
                defaultValue={opts.find((option) => option.default).value}
            >
                {({ open }) => (
                    <>
                        <Listbox.Button
                            as={SlimInputButton}
                            id="period-select-btn"
                            style={{
                                color: 'var(--m-text-gray)',
                                marginTop: hasLabel ? '.375em' : '0'
                            }}
                            ref={buttonRef}
                        >
                            {labelPrefix && `${labelPrefix} `}
                            {`${opts.find((option) => option.value === localValue)?.label}`
                            }
                            {<ArrowIcon
                                width={'.8em'}
                                height={'.8em'}
                                stroke={`var(--m-text-gray)`}
                            />}
                        </Listbox.Button>
                        <Listbox.Options className="select-container" static>
                            <DropAnimation
                                placement='left'
                                className="dropdown select"
                                visible={open}
                                style={{
                                    minWidth: `${buttonRef?.current?.offsetWidth}px`,
                                }}
                            >
                                <Options />
                            </DropAnimation>
                        </Listbox.Options>
                    </>
                )}
            </Listbox>
        </>
    )
}

export default PeriodSelect
