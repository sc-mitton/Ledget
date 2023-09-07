import React from 'react'

const CheckMark = ({
    className = 'checkmark',
    stroke = "#292929",
    width = ".9em",
    height = ".9em"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="Checkmark"
        >
            <g>
                <polyline
                    fill="none"
                    stroke={stroke}
                    strokeWidth="16"
                    strokeLinejoin='round'
                    strokeLinecap='round'
                    points="6.1,55.8 36.6,86.3 90.2,7.9 " />
            </g >
        </svg >
    )
}

export default CheckMark
