import React, { useRef } from 'react'

import './styles/Text.css'
import Emoji from './Emoji'

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

export const EmojiComboText = React.forwardRef((props, ref) => {
    const { emoji, setEmoji, children, register, ...rest } = props
    const { ref: formRef, ...registerRest } = register('name')

    return (
        <>
            <label htmlFor={rest.name}>Name</label>
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
                {children}
            </TextInput>
        </>
    )
})

export const DollarInput = (props) => {
    const { dollar, setDollar, register, ...rest } = props

    const { onChange, onBlur, onFocus, ...registerRest } = register(props.name)

    return (
        <input
            type="text"
            placeholder="$0"
            value={dollar}
            {...rest}
            {...registerRest}
            onChange={(e) => {
                const formatted = e.target.value
                    .replace(/[^0-9.]/g, '')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                setDollar(`$${formatted}`)
                onChange && onChange(e)
            }}
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

