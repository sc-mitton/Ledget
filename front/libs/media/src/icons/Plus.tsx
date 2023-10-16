import React from 'react'

const Plus = ({
    className = '',
    width = "1.2em",
    height = "1.2em",
    stroke = "#292929",
    strokeWidth = "20"
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
            aria-label='plus'
        >
            <line
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                x1="72" y1="19.91" x2="72" y2="124.09"
            />
            <line
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                x1="19.91" y1="72" x2="124.09" y2="72"
            />
        </svg>
    )
}

export default Plus
