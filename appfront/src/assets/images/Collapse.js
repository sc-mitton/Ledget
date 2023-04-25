import React from 'react'

const Ellipsis = ({
    className = null,
    width = "1.2em",
    height = "1.2em",
    stroke = "#242424",
    strokeWidth = "16"
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
            <polyline
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeLinejoin='round'
                points="129.62,121.73 71.97,73.03 14.47,121.58 "
            />
            <polyline
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeLinejoin='round'
                points="129.62,70.25 71.97,21.56 14.47,70.11 "
            />
        </svg>
    )
}

export default Ellipsis
