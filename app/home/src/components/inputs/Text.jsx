import React, { useRef, useEffect, useState } from 'react'

import { useController } from 'react-hook-form'

import './styles/Text.css'
import Emoji from './Emoji'
import { FormErrorTip, FormError } from '@components/pieces'
import { formatCurrency, formatRoundedCurrency, makeIntCurrencyFromStr } from '@utils'

export const TextInput = (props) => {

    const { className, children, ...rest } = props

    return (
        <div className={`input-container ${className || ''}`} {...rest}>
            {children}
        </div>
    )
}

export const MenuTextInput = (props) => {
    const { className, onClick, children, ...rest } = props
    const ref = useRef(null)

    const handleClick = (event) => {
        // focus input element inside the container
        ref.current.querySelector('input').focus()
        onClick && onClick(event)
    }

    return (
        <div
            className={`menu-text-input-container ${className || ''}`}
            onClick={handleClick}
            ref={ref}
            {...rest}
        >
            <div>
                {children}
            </div>
        </div>
    )
}

export const EmojiComboText = (props) => {
    const {
        children,
        register,
        error,
        ...rest
    } = props
    const { ref: formRef, ...registerRest } = register('name')
    const ref = useRef(null)
    const [emoji, setEmoji] = useState(undefined)

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
            <TextInput>
                <input
                    name='limit_amount'
                    type="text"
                    id="limit_amount"
                    placeholder="$0"
                    value={val}
                    ref={field.ref}
                    onChange={(e) => {
                        field.onChange(makeIntCurrencyFromStr(e.target.value))
                        setVal(formatRoundedCurrency(e.target.value))
                    }}
                    onBlur={(e) => {
                        e.target.value.length <= 1 && setVal('')
                        field.onBlur(e)
                    }}
                    size="14"
                />
                {children}
            </TextInput>
        </>
    )
}

const DollarInput = ({ field, name }) => {
    const [val, setVal] = useState(undefined)

    return (
        <input
            name={name}
            type="text"
            placeholder="$0"
            ref={field.ref}
            value={val}
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
            <TextInput >
                {rangeMode &&
                    <DollarInput field={lowerField} name={'lower_amount'} />
                }
                <DollarInput field={upperField} name={'upper_amount'} />
                <FormErrorTip errors={[errors.upper_amount, errors.lower_amount]} />
            </TextInput>
            {(errors.lower_amount?.type !== 'required' && errors.lower_amount?.message !== 'required')
                && <FormError msg={errors.lower_amount?.message} />}
        </>
    )
}
