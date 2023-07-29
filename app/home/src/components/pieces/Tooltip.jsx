import React, { useState, useRef } from 'react'
import './styles/Tooltip.css'

const Tooltip = ({ msg, ariaLabel, children }) => {
    const [show, setShow] = useState(false)
    const timeoutRef = useRef(null)

    const style = {
        display: 'inline-block',
        position: 'relative',
    }

    const handleMouseEnter = () => {
        // Set a timeout to show the tooltip after 2 seconds
        timeoutRef.current = setTimeout(() => {
            setShow(true)
        }, 1200) // 2000 milliseconds = 2 seconds
    }

    const handleMouseLeave = () => {
        // Clear the timeout if the user leaves before 2 seconds
        clearTimeout(timeoutRef.current)
        setShow(false)
    }

    return (
        <div
            className="tooltip"
            style={style}
            aria-label={ariaLabel}
            role="tooltip"
            aria-hidden={show ? 'false' : 'true'}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <span className={`tooltiptext ${show ? 'show' : ''}`}>{msg}</span>
        </div>
    )
}

export default Tooltip
