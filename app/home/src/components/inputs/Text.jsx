import React, { useRef } from 'react'

import './styles/Text.css'
import Emoji from './Emoji'

export const TextInput = ({ children }) => {

    return (
        <div className="input-container">
            {children}
        </div>
    )
}

export const MenuTextInput = ({ children }) => {
    const ref = useRef(null)

    const handleClick = (event) => {
        // focus input element inside the container
        ref.current.querySelector('input').focus()
    }

    return (
        <div className="menu-text-input-container" onClick={handleClick} ref={ref}>
            <div>
                {children}
            </div>
        </div>
    )
}

export const NameInput = React.forwardRef((props, ref) => {
    const { emoji, setEmoji, children, register, ...rest } = props
    const { ref: formRef, ...registerRest } = register('name')

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
                    className="category-name"
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
