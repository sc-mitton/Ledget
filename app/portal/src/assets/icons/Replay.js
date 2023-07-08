import React from 'react'

const Refresh = ({
    className = null,
    width = "1.1em",
    height = "1.1em",
    fill = "#242424",
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
            aria-label="Deal"
        >
            <path fill={fill} d="M72,24.7h-1.1l12-12l-9.3-9.3L43.3,33.6l30.2,30.2l9.3-9.3L70.1,41.8H72c21.2,0,38.4,17.2,38.4,38.4
            	c0,21.2-17.2,38.4-38.4,38.4c-21.2,0-38.4-17.2-38.4-38.4H16.5c0,30.6,24.9,55.5,55.5,55.5c30.6,0,55.5-24.9,55.5-55.5
            	C127.5,49.6,102.6,24.7,72,24.7z"/>
        </svg>

    )
}

export default Refresh
