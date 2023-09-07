import React, { useRef } from 'react'

import './text.css'

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
