import React from 'react'

const Star = ({
    className = null,
    width = ".7em",
    height = ".7em",
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
            <path fill={fill} d="M75.1,12.7l15.1,38.3c0.5,1.2,1.6,2,2.9,2.1l41.1,2.5c3,0.2,4.2,4,1.9,5.9l-31.8,26.2c-1,0.8-1.4,2.1-1.1,3.4
    l10.3,39.9c0.8,2.9-2.5,5.2-5,3.6l-34.7-22.1c-1.1-0.7-2.5-0.7-3.6,0l-34.7,22.1c-2.5,1.6-5.7-0.7-5-3.6l10.3-39.9
    c0.3-1.2-0.1-2.6-1.1-3.4L8,61.5c-2.3-1.9-1.1-5.7,1.9-5.9L51,53.2c1.3-0.1,2.4-0.9,2.9-2.1l15.1-38.3C70,9.9,74,9.9,75.1,12.7z"
            />
        </svg>

    )
}

export default Star
