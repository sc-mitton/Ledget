import React from 'react'

const Alert2 = ({
    className = null,
    width = "1em",
    height = "1em",
    fill = "#292929",
}) => {

    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label='alert'
        >
            <circle fill="#FFFFFF" cx="16" cy="16.1" r="16" />
            <g>
                <path fill={fill} d="M18.5,25.7c0,0.4-0.3,0.6-0.6,0.6h-3.7c-0.4,0-0.6-0.3-0.6-0.6V22c0-0.4,0.3-0.6,0.6-0.6l3.7,0
                    c0.4,0,0.6,0.3,0.6,0.6V25.7z"/>
            </g>
            <g>
                <path fill={fill} d="M18.6,18.2c0,0.4-0.3,0.7-0.6,0.7l-3.8,0c-0.4,0-0.6-0.3-0.6-0.7V6.7c0-0.4,0.3-0.7,0.6-0.7H18
                    c0.4,0,0.6,0.3,0.6,0.7C18.6,6.7,18.6,18.2,18.6,18.2z"/>
            </g>
        </svg>
    )
}

export default Alert2
