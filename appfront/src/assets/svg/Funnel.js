import React from 'react'

const CashFlow = ({
    className = null,
    width = "1.2em",
    height = "1.2em",
    fill = "#242424",
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            fill={fill}
            aria-label="Cash Flow"
        >
            <path d="M120.22,16.14H23.78c-5.09,0-7.9,5.91-4.68,9.85l39.72,49.09v39.2c0,2.02,1.01,3.91,2.69,5.04l14.26,9.51
    c4.02,2.68,9.41-0.2,9.41-5.03V75.09L124.9,26C128.12,22.05,125.31,16.14,120.22,16.14z"/>
        </svg>
    )
}

export default CashFlow
