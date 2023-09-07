import React, { useRef, useEffect, useState } from 'react'

import { useController } from 'react-hook-form'

import './styles/Text.css'
import Emoji from './Emoji'
import { formatCurrency, formatRoundedCurrency, makeIntCurrencyFromStr } from '@ledget/shared-utils'
import { IconButton2, TextInput, FormErrorTip, FormError } from '@ledget/shared-ui'
import { ArrowIcon } from '@ledget/shared-assets'

export const EmojiComboText = (props) => {
    const {
        children,
        register,
        error,
        emoji: propsEmoji,
        setEmoji: propsSetEmoji,
        ...rest
    } = props
    const { ref: formRef, ...registerRest } = register('name')
    const ref = useRef(null)
    const [em, setEm] = useState(undefined)
    const emoji = propsEmoji || em
    const setEmoji = propsSetEmoji || setEm

    useEffect(() => {
        emoji && ref.current.focus()
    }, [emoji])

    return (
        <>
            <label htmlFor="name">Name</label>
            <TextInput>
                <Emoji emoji={emoji} setEmoji={setEmoji}>
                    {({ emoji }) => (
                        <>
                            <div id="emoji-picker-ledget--button-container">
                                <Emoji.Button emoji={emoji} />
                            </div>
                            <Emoji.Picker />
                            {emoji && <input type="hidden" name="emoji" value={emoji.native} />}
                        </>
                    )}
                </Emoji>
                <input
                    type="text"
                    {...rest}
                    {...registerRest}
                    ref={(e) => {
                        formRef(e)
                        ref.current = e
                    }}
                />
                <FormErrorTip errors={error} />
            </TextInput>
        </>
    )
}

const increment = (val, setVal, field) => {
    let newVal
    if (!val || val === '') {
        newVal = 1000
    } else {
        newVal = makeIntCurrencyFromStr(val)
        newVal += 1000
    }

    field.onChange(newVal)
    setVal(formatRoundedCurrency(newVal))
}

const decrement = (val, setVal, field) => {
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

const IncrementDecrementButton = ({ val, setVal, field }) => (
    <div className="increment-arrows--container">
        <IconButton2
            type="button"
            onClick={() => increment(val, setVal, field)}
            aria-label="increment"
            tabIndex={'-1'}
        >
            <ArrowIcon width={'.75em'} height={'.75em'} rotation={-180} />
        </IconButton2>
        <IconButton2
            type="button"
            onClick={() => decrement(val, setVal, field)}
            aria-label="decrement"
            tabIndex={'-1'}
        >
            <ArrowIcon width={'.75em'} height={'.75em'} />
        </IconButton2>
    </div>
)

export const LimitAmountInput = ({ control, children }) => {
    const [val, setVal] = useState(undefined)
    const {
        field,
    } = useController({
        control,
        name: 'limit_amount'
    })

    return (
        <>
            <label htmlFor="limit">Limit</label>
            <TextInput className="limit-amount--container">
                <input
                    name='limit_amount'
                    type="text"
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
                        field.onBlur(e)
                    }}
                    size="14"
                />
                <IncrementDecrementButton val={val} setVal={setVal} field={field} />
                {children}
            </TextInput>
        </>
    )
}

const DollarInput = ({ field, name, ...rest }) => {
    const [val, setVal] = useState(undefined)

    return (
        <TextInput className="limit-amount--container" {...rest}>
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
                size="14"
            />
            <IncrementDecrementButton val={val} setVal={setVal} field={field} />
        </TextInput>
    )
}

export const DollarRangeInput = ({ rangeMode, control, errors = {} }) => {
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
            <label htmlFor="upper_amount">Amount</label>
            <div className="dollar-range-input--container">
                {rangeMode &&
                    <>
                        <DollarInput
                            style={{ marginRight: '8px' }}
                            field={lowerField}
                            name={'lower_amount'}
                        />
                        <FormErrorTip errors={[errors.lower_amount]} />
                    </>
                }
                <DollarInput
                    field={upperField}
                    name={'upper_amount'}
                />
                <FormErrorTip errors={[errors.upper_amount]} />
                {(errors.lower_amount?.type !== 'required' && errors.lower_amount?.message !== 'required')
                    && <FormError msg={errors.lower_amount?.message} />}
            </div>
        </>
    )
}
