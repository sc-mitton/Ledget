import React from 'react'

const Refresh = ({
    className = null,
    width = "1.3em",
    height = "1.3em",
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
            aria-label="resend"
        >
            <path fill={fill} d="M72,34.2h-0.9l9.5-9.5l-7.3-7.3L49.4,41.2L73.2,65l7.3-7.3l-10-10H72c16.7,0,30.3,13.6,30.3,30.3
            S88.7,108.2,72,108.2S41.7,94.6,41.7,77.9H28.3c0,24.1,19.6,43.7,43.7,43.7s43.7-19.6,43.7-43.7S96.1,34.2,72,34.2z"/>

        </svg>

    )
}

export default Refresh
