import React, { useState, useRef } from 'react'
import './styles/Tooltip.css'

const Tooltip = (props) => {
    const [show, setShow] = useState(false)
    const timeoutRef = useRef(null)
    const { msg, ariaLabel, children, type = 'top', style, ...rest } = props

    const handleMouseEnter = () => {
        // Set a timeout to show the tooltip after 2 seconds
        timeoutRef.current = setTimeout(() => {
            setShow(true)
        }, 1000) // 1000 milliseconds
    }

    const handleMouseLeave = () => {
        // Clear the timeout if the user leaves before 2 seconds
        clearTimeout(timeoutRef.current)
        setShow(false)
    }

    return (
        <div
            className="tooltip"
            style={{
                display: 'inline-block',
                position: 'relative'
            }}
            aria-label={ariaLabel}
            role="tooltip"
            aria-hidden={show ? 'false' : 'true'}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <span
                style={style}
                className={`tooltiptext ${show ? 'show' : ''} ${type}`} {...rest}
            >
                {msg}
            </span>
        </div>
    )
}

export default Tooltip
