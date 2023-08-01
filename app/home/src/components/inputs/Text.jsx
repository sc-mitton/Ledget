import React, { useRef } from 'react'

import './styles/Text.css'

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
