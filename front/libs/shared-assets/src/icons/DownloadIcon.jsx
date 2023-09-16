import React from 'react'

const Download = ({
    stroke = 'var(--m-text-gray)',
    strokeWidth = "16",
    width = "1em",
    height = "1em",
    className = ''
}) => {
    const centerX = 144 / 2
    const centerY = 144 / 2

    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox={`0 0 ${144} ${144}`}
            aria-label="Download Icon"
        >
            <path
                fill='none'
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                d="M124.1,86.7v22.4c0,8.3-6.7,15-15,15H34.9c-8.3,0-15-6.7-15-15V86.7"
            />
            <line
                fill='none'
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                x1="72.3" y1="28.3" x2="72.3" y2="89.4"
            />
            <polyline
                fill='none'
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                points="94.3,67.4 72.3,89.4 50.1,67.2 "
            />
        </svg >
    )
}

export default Download
