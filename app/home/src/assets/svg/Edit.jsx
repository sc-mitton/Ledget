import React from 'react'

const Edit = ({
    width = "1em",
    height = "1em",
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
            <path fill={fill} d="M20,105.3c-0.9-0.9-2.3-1.3-3.5-0.9c-1.1,0.3-1.9,1.2-2.2,2.3l-8.6,25.5l-0.1,0.2c-0.5,2,0.2,4.2,1.7,5.7
                c1.2,1.2,2.7,1.8,4.2,1.8c0.4,0,0.9-0.1,1.3-0.2L38,131c1.1-0.3,2-1.1,2.3-2.2c0.4-1.2,0.1-2.6-0.9-3.5L20,105.3z"/>
            <path fill={fill} d="M133.7,9.6c-3.6-3.8-8.5-6-13.5-6.1c-4.6,0-8.8,1.7-11.9,4.8L25.6,92.8c-1.7,1.9-1.6,4.8,0.2,6.7l19.5,19.7
                c0.9,0.9,2,1.4,3.3,1.4c0.1,0,0.1,0,0.2,0c1.2,0,2.3-0.5,3.2-1.3l82.1-84.1C140.9,28.2,140.7,17,133.7,9.6z"/>
        </svg>
    )
}

export default Edit
