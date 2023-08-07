import React from 'react'

const BackArrow = ({
    className = null,
    width = ".9em",
    height = ".9em",
    stroke = "#292929",
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
            aria-label='back'
        >
            <line
                className='arrow-tail'
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin='round'
                strokeLinecap='round'
                fill='none'
                x1="126.3" y1="72" x2="16.1" y2="72"
            />
            <polyline
                className='arrow-head'
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin='round'
                strokeLinecap='round'
                fill='none'
                points="60.7,116.7 16.1,72 61.1,27 "
            />
        </svg>
    )
}

export default BackArrow
