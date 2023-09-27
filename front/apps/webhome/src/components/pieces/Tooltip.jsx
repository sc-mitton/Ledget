import React from 'react'
import './styles/Tooltip.css'

const Tooltip = (props) => {
    const { msg, ariaLabel, children, type = 'top', style, ...rest } = props

    return (
        <div
            className="tooltip"
            aria-label={ariaLabel}
            role="tooltip"
        >
            {children}
            <span
                style={style}
                className={`tooltiptext ${type}`}
                {...rest}
            >
                {msg}
            </span>
        </div>
    )
}

export default Tooltip
