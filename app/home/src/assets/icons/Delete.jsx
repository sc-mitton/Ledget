import React from 'react'

const Delete = ({
    className = null,
    fill = "#292929",
    width = "1.2em",
    height = "1.2em"
}) => {

    return (

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
                <path fill={fill} d="M72,4.7C34.8,4.7,4.7,34.8,4.7,72s30.1,67.3,67.3,67.3s67.3-30.1,67.3-67.3S109.2,4.7,72,4.7z M110.7,81.1H33.3V62.9h77.4
                    V81.1z"/>
            </g>
        </svg>

    )
}

export default Delete
