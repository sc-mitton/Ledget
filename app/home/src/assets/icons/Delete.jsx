import React from 'react'

const Delete = ({
    className = null,
    fill = "#292929",
    width = "1em",
    height = "1em",
    stroke = "#FFFFFF",
    strokeWidth = "19"
}) => {

    return (
        <>
            <svg
                width={width}
                height={height}
                viewBox="0 0 144 144"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                aria-label="Delete"
            >
                <g>
                    <path fill={fill} d="M72,4.7C34.8,4.7,4.7,34.8,4.7,72s30.1,67.3,67.3,67.3s67.3-30.1,67.3-67.3S109.2,4.7,72,4.7z" />
                </g>
                <line stroke={stroke} strokeWidth={strokeWidth} x1="33.3" y1="72" x2="110.7" y2="72" />
                <line className="animated-stroke" stroke={stroke} strokeWidth={strokeWidth} x1="72" y1="33.3" x2="72" y2="110.7" />
            </svg>
        </>
    )
}

export default Delete
