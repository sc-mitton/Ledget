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
                d="M134,88.4V115c0,9.9-8,17.9-17.9,17.9H27.8c-9.9,0-17.9-8-17.9-17.9V88.4"
            />
            <line
                fill='none'
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                x1="72.4" y1="10.5" x2="72.4" y2="91.6"
            />
            <polyline
                fill='none'
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                points="98.5,65.4 72.4,91.6 45.9,65.2 "
            />
        </svg >
    )
}

export default Download
