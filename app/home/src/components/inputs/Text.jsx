import React, { useRef, useEffect, useState } from 'react'

import './styles/Text.css'
import Emoji from './Emoji'
import { FormErrorTip, FormError } from '@components/pieces'

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
    const { emoji, setEmoji, children, register, error, ...rest } = props
    const { ref: formRef, ...registerRest } = register('name')

    const ref = useRef(null)

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

export const EvenDollarInput = (props) => {
    const { dollarLimit, setDollarLimit, register } = props
    const { onBlur, onChange, ...rest } = register('limit')

    const handleChange = (e) => {
        const formatted = e.target.value
            .replace(/[^0-9]/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        setDollarLimit(`$${formatted}`)
        onChange && onChange(e)
    }

    const hanldeBlur = (e) => {
        e.target.value.length <= 1 && setDollarLimit('')
        onBlur && onBlur(e)
    }

    return (
        <>
            <label htmlFor="limit">Limit</label>
            <TextInput>
                <input
                    name={props.name}
                    type="text"
                    id="limit"
                    placeholder="$0"
                    value={dollarLimit}
                    onChange={handleChange}
                    onBlur={hanldeBlur}
                    size="14"
                    {...rest}
                />
                {props.children}
            </TextInput>
        </>
    )
}

export const DollarRangeInput = (props) => {
    const {
        mode: rangeMode,
        register,
        errors
    } = props

    const [lowerAmount, setLowerAmount] = useState('')
    const [upperAmount, setUpperAmount] = useState('')

    const { onChange: lowerChange, onBlur: lowerBlur, ...lowerRest } = register('lower_amount')
    const { onChange: upperChange, onBlur: upperBlur, ...upperRest } = register('upper_amount')

    const handleChange = (e) => {
        const cleaned = e.target.value.replace(/[^0-9]/g, '')
        const dollar = cleaned.slice(0, cleaned.length - 2)
        const cents = cleaned.slice(cleaned.length - 2)

        const newVal = `$${dollar.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${cents && '.' + cents}`
        if (e.target.name === 'lower_amount') {
            setLowerAmount(newVal)
            lowerChange && lowerChange(e)
        } else {
            setUpperAmount(newVal)
            upperChange && upperChange(e)
        }
    }

    return (
        <>
            <label htmlFor="upper_amount">Amount</label>
            <TextInput >
                {rangeMode &&
                    <input
                        name="lower_amount"
                        type="text"
                        placeholder="$0"
                        value={lowerAmount}
                        onChange={handleChange}
                        onBlur={(e) => {
                            lowerAmount.length <= 1 && setLowerAmount('')
                            lowerBlur && lowerBlur(e)
                        }}
                        size="14"
                        {...lowerRest}
                    />
                }
                <input
                    name="upper_amount"
                    type="text"
                    placeholder="$0"
                    value={upperAmount}
                    onChange={handleChange}
                    onBlur={(e) => {
                        upperAmount.length <= 1 && setUpperAmount('')
                        upperBlur && upperBlur(e)
                    }}
                    size="14"
                    {...upperRest}
                />
                <FormErrorTip errors={[errors.upper_amount, errors.lower_amount]} />
            </TextInput>
            {(errors.lower_amount?.type !== 'required' && errors.lower_amount?.message !== 'required')
                && <FormError msg={errors.lower_amount?.message} />}
        </>
    )
}
