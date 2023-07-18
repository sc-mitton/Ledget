import React from 'react'

const Edit = ({
    width = "1.2em",
    height = "1.2em",
    className = null,
    fill = "#242424",
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            fill={fill}
            aria-label='edit'
            className={className}
        >
            <path d="M37.2,125.8c0.7,0.7,0.3,1.9-0.6,2.1l-22.2,8.6c-2.4,0.7-4.7-1.6-4-4.1l8.5-22.6c0.2-0.9,1.4-1.3,2.1-0.6L37.2,125.8z" />
            <path d="M28.9,101.3c-0.9-0.9-0.9-2.4,0-3.4l75.2-76.7c5.4-5.5,14.3-5.5,19.6,0.2c5.3,5.6,4.8,14.4-0.5,19.9l-74.8,76.4
	c-0.9,0.9-2.4,0.9-3.3,0L28.9,101.3z"/>
        </svg>
    )
}

export default Edit
