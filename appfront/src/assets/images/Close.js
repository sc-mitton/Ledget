import React from 'react'

const Close = ({
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
        >
            <line
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeLinejoin='round'
                x1="18.2"
                y1="125.8"
                x2="125.8"
                y2="18.2"
            />
            <line
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeLinejoin='round'
                x1="125.8"
                y1="125.8"
                x2="18.2"
                y2="18.2"
            />

        </svg>
    )
}

export default Close
