import React from 'react'

const Logout = ({
    className = null,
    width = "1.1em",
    height = "1.1em",
    stroke = "#f8f8f8",
    strokeWidth = "15",
    strokeLinecap = "round",
    strokeLinejoin = "round"
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
            aria-label="Profile"
        >
            <path
                stroke={stroke}
                fill='none'
                strokeWidth={strokeWidth}
                strokeLinecap={strokeLinecap}
                d="M77.7,104.3c0,11.1-9,20-20,20H31.6c-11.1,0-20-9-20-20V39.7c0-11.1,9-20,20-20h26.1c11.1,0,20,9,20,20"
            />
            <line
                stroke={stroke}
                fill='none'
                strokeWidth={strokeWidth}
                strokeLinecap={strokeLinecap}
                x1="51.5" y1="71.9" x2="133.7" y2="71.9"
            />
            <polyline
                stroke={stroke}
                fill='none'
                strokeWidth={strokeWidth}
                strokeLinecap={strokeLinecap}
                strokeLinejoin={strokeLinejoin}
                points="108.2,46.4 133.7,71.9 108,97.6 "
            />
        </svg>

    )
}

export default Logout
