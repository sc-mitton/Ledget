import React from 'react'

const Split = ({
    width = "1em",
    height = "1em",
    className = '',
    fill = "#292929"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 144 144`}
            className={className}
        >
            <path fill={fill} d="M62.5,104.2H13.3c-5.1,0-9.3-4.2-9.3-9.3V49.4c0-5.1,4.2-9.3,9.3-9.3h49.2" />
            <path fill={fill} d="M80.7,40.2h49.2c5.1,0,9.3,4.2,9.3,9.3v45.5c0,5.1-4.2,9.3-9.3,9.3H80.7" />
        </svg >
    )
}

export default Split
