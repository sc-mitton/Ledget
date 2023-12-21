import { useState, useEffect } from 'react'

import { Control } from 'react-hook-form'

import { SlimmestInputButton, BakedListBox } from '@ledget/ui'

const baseopts = [
    { id: 1, value: 'month', label: 'Monthly', disabled: false, default: true },
    { id: 2, value: 'year', label: 'Yearly', disabled: false, default: false },
    { id: 3, value: 'once', label: 'Once', disabled: true, default: false }
]

interface P {
    hasLabel?: boolean
    labelPrefix?: string
    enableAll?: boolean
    default?: typeof baseopts[number]['value']
    control: Control<any>
    name?: string
}

const PeriodSelect = (props: P) => {
    const {
        hasLabel,
        enableAll,
        default: defaultValue,
        labelPrefix,
        control,
        name
    } = props

    const [options, setOptions] = useState<typeof baseopts>(baseopts)

    useEffect(() => {
        const newOptions = baseopts.map(op => enableAll ? { ...op, disabled: false } : op)
        setOptions(newOptions)
    }, [enableAll, defaultValue])

    return (
        <>
            {hasLabel && <label htmlFor="period">Refreshes</label>}
            <BakedListBox
                control={control as any}
                name={name}
                as={SlimmestInputButton}
                options={options}
                defaultValue={options.find(op => op.value === defaultValue)}
                labelPrefix={labelPrefix}
            />
        </>
    )
}

export default PeriodSelect
