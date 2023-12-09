import { useState, useEffect } from 'react'

import { SlimInputButton, BakedListBox } from '@ledget/ui'

const opts = [
    { id: 1, value: 'month', label: 'Monthly', disabled: false, default: true },
    { id: 2, value: 'year', label: 'Yearly', disabled: false, default: false },
    { id: 3, value: 'once', label: 'Once', disabled: true, default: false }
]

interface P {
    hasLabel?: boolean
    labelPrefix?: string
    value?: typeof opts[number]['value']
    onChange?: (val: typeof opts[number]['value']) => void
    enableAll?: boolean
    default?: string
}

const PeriodSelect = (props: P) => {
    const {
        hasLabel,
        labelPrefix,
        value: propsValue,
        onChange,
        enableAll,
        default: defaultValue
    } = props

    const [options, setOptions] = useState<typeof opts>(opts)
    const [value, setValue] = useState<typeof opts[number]['value']>()
    const localSetValue = onChange || setValue
    const localValue = propsValue || value

    useEffect(() => {
        setOptions(opts.map((op) => {
            return {
                ...op,
                disabled: !enableAll && op.value !== defaultValue
            }
        }))
    }, [enableAll, defaultValue])

    return (
        <>
            {hasLabel && <label htmlFor="period">Refreshes</label>}
            <BakedListBox
                name='period'
                as={SlimInputButton}
                options={options}
                value={localValue}
                onChange={localSetValue}
                labelPrefix={labelPrefix}
            />
        </>
    )
}

export default PeriodSelect
