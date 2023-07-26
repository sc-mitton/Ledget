import React from 'react'

const Ellipsis = ({
    className = null,
    fill = "#242424",
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
            aria-label="Ellipsis"
        >
            <circle fill={fill} cx="16.5" cy="72.2" r="14.3" />
            <circle fill={fill} cx="71.6" cy="72.2" r="14.3" />
            <circle fill={fill} cx="126.7" cy="72.2" r="14.3" />
        </svg>

    )
}

export default Ellipsis
