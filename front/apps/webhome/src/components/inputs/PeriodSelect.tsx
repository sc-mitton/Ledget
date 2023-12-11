import { useState, useEffect } from 'react'

import { Control, useController } from 'react-hook-form'

import { SlimInputButton, BakedListBox } from '@ledget/ui'

const opts = [
    { id: 1, value: 'month', label: 'Monthly', disabled: false, default: true },
    { id: 2, value: 'year', label: 'Yearly', disabled: false, default: false },
    { id: 3, value: 'once', label: 'Once', disabled: true, default: false }
]

interface P {
    hasLabel?: boolean
    labelPrefix?: string
    enableAll?: boolean
    default?: string
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

    const [options, setOptions] = useState<typeof opts>(opts)
    const [value, setValue] = useState<typeof opts[number]>()

    useEffect(() => {
        setOptions(opts.filter(op => enableAll ? false : !op.disabled))
    }, [enableAll, defaultValue])

    const { field } = useController({
        name: name || 'period',
        control
    })

    useEffect(() => {
        field.onChange(value)
    }, [value])

    return (
        <>
            {hasLabel && <label htmlFor="period">Refreshes</label>}
            <BakedListBox
                as={SlimInputButton}
                options={options}
                onChange={setValue}
                labelPrefix={labelPrefix}
            />
        </>
    )
}

export default PeriodSelect
