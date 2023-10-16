import React from 'react'

const CheckAll = ({
    className = 'check-all',
    fill = "#292929",
    width = "1.3em",
    height = "1.3em"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="Check all"
        >
            <g>
                <path fill={fill} d="M80.5,114.4c-1.7,0-3.3-0.7-4.5-1.9L43.4,80c-2.5-2.5-2.5-6.5,0-9c2.5-2.5,6.5-2.5,9,0l27.2,27.2l45.1-65.9
                c2-2.9,5.9-3.6,8.8-1.7c2.9,2,3.6,5.9,1.7,8.8l-49.4,72.2c-1.1,1.6-2.8,2.6-4.6,2.7C80.9,114.4,80.7,114.4,80.5,114.4z"/>
                <g>
                    <path fill={fill} d="M95.2,30.7c-2.9-2-6.8-1.2-8.8,1.7L60.7,70.9l9.3,8.9l26.9-40.3C98.8,36.6,98.1,32.6,95.2,30.7z" />
                    <path fill={fill} d="M45.3,91.6l-3.9,6.6L18.6,75.5c-2.5-2.5-6.5-2.5-9,0c-2.5,2.5-2.5,6.5,0,9l28.1,28.1c1.2,1.2,2.8,1.9,4.5,1.9
                    c0.2,0,0.4,0,0.6,0c1.9-0.2,3.6-1.2,4.6-2.7l6.9-11.1L45.3,91.6z"/>
                </g>
            </g>
        </svg >
    )
}

export default CheckAll
