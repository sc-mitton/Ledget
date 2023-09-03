import React from 'react'

const Refresh = ({
    className = null,
    width = "1.3em",
    height = "1.3em",
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
            aria-label="resend"
        >
            <path fill={fill} d="M97.9,62.4c2.9,4.8,4.4,10.1,4.4,15.5l0,0c0,16.7-13.6,30.3-30.3,30.3S41.7,94.7,41.7,78S55.3,47.7,72,47.7h1.5
            l-10,10l7.3,7.3l23.8-23.8L70.7,17.4l-7.3,7.3l9.5,9.5H72c-24.1,0-43.7,19.6-43.7,43.7s19.6,43.7,43.7,43.7s43.7-19.6,43.7-43.7v0.2
            c0-8.6-2.5-16.6-6.8-23.4L97.9,62.4z"/>
        </svg>

    )
}

export default Refresh
