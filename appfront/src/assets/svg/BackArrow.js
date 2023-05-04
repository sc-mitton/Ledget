import React from 'react'

const BackArrow = ({
    className = null,
    width = "1em",
    height = "1em",
    stroke = "#363636",
    strokeWidth = "24"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label='close'
        >
            <line
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeLinejoin='round'
                x1="126.3" y1="72" x2="16.1" y2="72"
            />
            <polyline
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeLinejoin='round'
                points="60.7,116.7 16.1,72 61.1,27 "
            />
        </svg>
    )
}

export default BackArrow
