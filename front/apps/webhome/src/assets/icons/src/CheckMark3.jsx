import React from 'react'

const CheckMark3 = ({
    className = 'checkmark3',
    fill = "var(--green-hlight)",
    stroke = "var(--green-dark3)",
    strokeWidth = "17",
    width = "1.1em",
    height = "1.1em"
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
            aria-label="Checkmark"
        >
            <circle
                fill={fill}
                cx="71.4"
                cy="72.2"
                r="69.5"
            />
            <polyline
                stroke={stroke}
                fill="none"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                points="46.2,75.6 64.2,93.3 96.6,51.2 "
            />
        </svg >
    )
}

export default CheckMark3
