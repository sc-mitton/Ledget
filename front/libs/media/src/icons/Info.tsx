import React from 'react'

const Info = ({
    className = '',
    width = "1em",
    height = "1em",
    fill = "#292929",
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
            aria-label="Info"
        >
            <g>
                <path fill={fill} d="M72,2.7C33.8,2.7,2.7,33.8,2.7,72s31.1,69.3,69.3,69.3s69.3-31.1,69.3-69.3C141.3,33.8,110.2,2.7,72,2.7z M80.4,114.2H63.6
                V61.9h16.8V114.2z M78.8,52.5c-1.7,1.6-4,2.4-6.8,2.4c-2.7,0-5-0.8-6.7-2.4c-1.8-1.6-2.6-3.7-2.6-6.2c0-2.6,0.9-4.7,2.6-6.2
                c1.7-1.5,4-2.3,6.7-2.3c2.8,0,5.1,0.8,6.8,2.3c1.7,1.5,2.6,3.6,2.6,6.2C81.3,48.9,80.5,51,78.8,52.5z"/>
            </g>
        </svg>

    )
}

export default Info
