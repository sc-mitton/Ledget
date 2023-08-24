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

export const DollarInput = (props) => {
    const { dollar, setDollar, register, ...rest } = props

    const { onChange, onBlur, onFocus, ...registerRest } = register(props.name)

    const handleChange = (e) => {
        const cleaned = e.target.value.replace(/[^0-9]/g, '')
        const dollar = cleaned.length > 2 ? cleaned.slice(0, cleaned.length - 2) : cleaned
        const cents = cleaned.length > 2 ? cleaned.slice(cleaned.length - 2) : ''

        setDollar(`$${dollar.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${cents && '.' + cents}`)
        onChange && onChange(e)
    }

    return (
        <input
            type="text"
            placeholder="$0"
            value={dollar}
            {...rest}
            {...registerRest}
            onChange={handleChange}
            onBlur={(e) => {
                dollar.length <= 1 && setDollar('')
                onBlur && onBlur(e)
            }}
            onFocus={(e) => {
                !dollar && setDollar('$')
                onFocus && onFocus(e)
            }}
            size="14"
        />

    )
}

export const DollarRangeInput = (props) => {
    const { mode: rangeMode, register, errors } = props
    const [lowerAmount, setlowerAmount] = useState('')
    const [upperAmount, setupperAmount] = useState('')

    return (
        <>
            <label htmlFor="upperAmount">Amount</label>
            <TextInput >
                {rangeMode &&
                    <DollarInput
                        dollar={lowerAmount}
                        setDollar={setlowerAmount}
                        name="lowerAmount"
                        id="lowerAmount"
                        register={register}
                    />
                }
                <DollarInput
                    dollar={upperAmount}
                    setDollar={setupperAmount}
                    name="upperAmount"
                    id="upperAmount"
                    register={register}
                />
                <FormErrorTip errors={[errors.upperAmount, errors.lowerAmount]} />
            </TextInput>
            {errors.lowerAmount?.type !== 'required'
                && <FormError msg={errors.lowerAmount?.message} />}
        </>
    )
}
