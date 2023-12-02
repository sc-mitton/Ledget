import React, { useRef, useEffect, useState } from 'react'

import { useController } from 'react-hook-form'
import { Control } from 'react-hook-form'

import './styles/Text.scss'
import Emoji from './Emoji'
import { EmojiProps, emoji } from './Emoji'
import { formatCurrency, formatRoundedCurrency, makeIntCurrencyFromStr } from '@ledget/ui'
import { IconButton2, TextInputWrapper, FormErrorTip, FormError } from '@ledget/ui'
import { ArrowIcon } from '@ledget/media'

export const EmojiComboText = (props: { register: any, error: any, hasLabel?: boolean } & EmojiProps) => {
    const {
        register,
        error,
        emoji: propsEmoji,
        setEmoji: propsSetEmoji,
        hasLabel = true,
        ...rest
    } = props

    const { ref: formRef, ...registerRest } = register('name')
    const ref = useRef<HTMLInputElement>()

    const [em, setEm] = useState<emoji>()
    const emoji = propsEmoji || em
    const setEmoji = propsSetEmoji || setEm

    useEffect(() => {
        emoji && ref.current?.focus()
    }, [emoji])

    return (
        <>
            {hasLabel && <label htmlFor="name">Name</label>}
            <TextInputWrapper>
                <Emoji emoji={emoji} setEmoji={setEmoji}>
                    {({ emoji }) => (
                        <>
                            <div id="emoji-picker-ledget--button-container">
                                <Emoji.Button
                                    id='emoji-picker-ledget--button'
                                    emoji={emoji}
                                />
                            </div>
                            <Emoji.Picker />
                            <input
                                type="hidden"
                                name="emoji"
                                value={typeof emoji === 'string' ? emoji : emoji?.native}
                            />
                        </>
                    )}
                </Emoji>
                <input
                    type="text"
                    {...rest}
                    {...registerRest}
                    ref={(e) => {
                        formRef(e)
                        if (e)
                            ref.current = e
                    }}
                    style={{ marginLeft: '.25em' }}
                />
                <FormErrorTip errors={error} />
            </TextInputWrapper>
        </>
    )
}

interface IncrementDecrement {
    val: string;
    setVal: React.Dispatch<React.SetStateAction<string>>;
    field: {
        onChange: (newVal: number) => void;
    }
}

type IncrementFunction = (
    ...args: [IncrementDecrement['val'], IncrementDecrement['setVal'], IncrementDecrement['field']]
) => void;


const increment: IncrementFunction = (val, setVal, field) => {
    let newVal: number
    if (!val || val === '') {
        newVal = 1000
    } else {
        newVal = makeIntCurrencyFromStr(val)
        newVal += 1000
    }

    field.onChange(newVal)
    setVal(formatRoundedCurrency(newVal))
}

const decrement: IncrementFunction = (val, setVal, field) => {
    let newVal
    if (!val) {
        newVal = 0
    } else {
        newVal = makeIntCurrencyFromStr(val)
    }

    newVal = newVal > 1000 ? newVal - 1000 : 0
    field.onChange(newVal)
    setVal(formatRoundedCurrency(newVal))
}

const IncrementDecrementButton = ({ val, setVal, field }: IncrementDecrement) => (
    <div className="increment-arrows--container">
        <IconButton2
            type="button"
            onClick={() => increment(val, setVal, field)}
            aria-label="increment"
            tabIndex={-1}
        >
            <ArrowIcon size={'.75em'} rotation={-180} />
        </IconButton2>
        <IconButton2
            type="button"
            onClick={() => decrement(val, setVal, field)}
            aria-label="decrement"
            tabIndex={-1}
        >
            <ArrowIcon size={'.75em'} />
        </IconButton2>
    </div>
)

export const LimitAmountInput = (
    { control, defaultValue, value, onChange, children, ...rest }: {
        control: Control,
        defaultValue?: string,
        value?: string,
        onChange?: React.Dispatch<React.SetStateAction<string>>,
        children?: React.ReactNode
        name?: string
    }
) => {
    const [sVal, sSetVal] = useState<string>('')
    const val = value || sVal
    const setVal = onChange || sSetVal

    const {
        field,
    } = useController({
        control,
        name: rest.name || 'limit_amount'
    })

    // set field value to default if present
    useEffect(() => {
        if (defaultValue) {
            field.onChange(makeIntCurrencyFromStr(defaultValue))
            setVal(defaultValue)
        }
    }, [defaultValue])

    return (
        <>
            <label htmlFor="limit">Limit</label>
            <TextInputWrapper className="limit-amount--container">
                <input
                    type="text"
                    name='limit_amount'
                    id="limit_amount"
                    placeholder="$0"
                    value={val}
                    ref={field.ref}
                    onKeyDown={(e) => {
                        if (e.key === 'Right' || e.key === 'ArrowRight') {
                            e.preventDefault()
                            increment(val, setVal, field)
                        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                            e.preventDefault()
                            decrement(val, setVal, field)
                        }
                    }}
                    onChange={(e) => {
                        field.onChange(makeIntCurrencyFromStr(e.target.value))
                        setVal(formatRoundedCurrency(e.target.value))
                    }}
                    onBlur={(e) => {
                        (e.target.value.length <= 1 || val === '$0') && setVal('')
                        field.onBlur()
                    }}
                    size={14}
                    {...rest}
                />
                <IncrementDecrementButton val={val} setVal={setVal} field={field} />
                {children}
            </TextInputWrapper>
        </>
    )
}

const DollarInput = (
    { field, name, defaultValue, error, style }:
        { field: any, name: string, defaultValue?: string, error?: any, style?: React.CSSProperties }
) => {
    const [val, setVal] = useState(defaultValue || '')

    // set field value to default if present
    useEffect(() => {
        if (defaultValue) {
            field.onChange(makeIntCurrencyFromStr(defaultValue))
            setVal(formatCurrency(defaultValue))
        }
    }, [defaultValue])

    return (
        <TextInputWrapper className="limit-amount--container" style={style}>
            <input
                name={name}
                type="text"
                placeholder="$0"
                ref={field.ref}
                value={val}
                onKeyDown={(e) => {
                    if (e.key === 'Right' || e.key === 'ArrowRight') {
                        e.preventDefault()
                        increment(val, setVal, field)
                    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                        e.preventDefault()
                        decrement(val, setVal, field)
                    }
                }}
                onChange={(e) => {
                    field.onChange(makeIntCurrencyFromStr(e.target.value))
                    setVal(formatCurrency(e.target.value))
                }}
                onBlur={(e) => {
                    field.onBlur(e)
                    e.target.value === '$0.00' && setVal('')
                }}
                size={14}
            />
            <IncrementDecrementButton val={val} setVal={setVal} field={field} />
            <FormErrorTip errors={[error]} />
        </TextInputWrapper>
    )
}

export const DollarRangeInput = (
    { control, defaultLowerValue, defaultUpperValue, errors, hasLabel = true, rangeMode = false }:
        { control: Control, defaultLowerValue: string, defaultUpperValue: string, errors: any, hasLabel?: boolean, rangeMode?: boolean }
) => {

    const {
        field: lowerField,
    } = useController({
        control,
        name: 'lower_amount'
    })
    const {
        field: upperField,
    } = useController({
        control,
        name: 'upper_amount'
    })

    return (
        <>
            {hasLabel && <label htmlFor="upper_amount">Amount</label>}
            <div className={`dollar-range-input--container ${rangeMode ? 'range-mode' : ''}`}>
                {rangeMode &&
                    <DollarInput
                        defaultValue={defaultLowerValue}
                        style={{ marginRight: '.5em' } as React.CSSProperties}
                        field={lowerField}
                        name={'lower_amount'}
                        error={errors.lower_amount}
                    />
                }
                <DollarInput
                    defaultValue={defaultUpperValue}
                    field={upperField}
                    name={'upper_amount'}
                    error={errors.upper_amount}
                />
            </div>
            {(errors.lower_amount?.type !== 'required' && errors.lower_amount?.message !== 'required')
                && <FormError msg={errors.lower_amount?.message} />}
            {(errors.lower_amount?.type !== 'required'
                && errors.lower_amount?.type !== 'typeError'
                && errors.lower_amount?.message !== 'required')
                && <FormError msg={errors.lower_amount?.message} />}
        </>
    )
}
