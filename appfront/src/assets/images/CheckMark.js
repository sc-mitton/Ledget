import React from 'react'

const CheckMark = ({
    className = 'checkmark',
    fill = "#242424",
    width = "1.1em",
    height = "1.1em"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
        >
            <g>
                <path d="M39.1,90.8c-2.3,0-4.4-0.9-5.8-2.4L7.6,61.2c-2.9-2.7-2.7-7,0.3-9.5c3-2.5,7.9-2.4,10.7,0.3
	c0.2,0.2,0.4,0.4,0.6,0.6l18.7,19.8l40.4-61.9c2.1-3.2,6.7-4.3,10.4-2.5c3.6,1.9,4.9,6,2.8,9.2L45.6,87.5c-1.2,1.9-3.4,3.1-5.9,3.3
	C39.5,90.8,39.3,90.8,39.1,90.8L39.1,90.8z"
                    fill={fill}
                />
            </g>

        </svg >
    )
}

export default CheckMark
