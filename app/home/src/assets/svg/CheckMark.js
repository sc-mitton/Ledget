import React from 'react'

const CheckMark = ({
    className = 'checkmark',
    fill = "#292929",
    width = "1.1em",
    height = "1.1em"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="Checkmark"
        >
            <g>
                <path fill={fill} d="M37.9,95.7c-2.6,0-4.9-1-6.5-2.7L2.8,62.6c-3.2-3-3-7.8,0.3-10.6c3.3-2.8,8.8-2.7,11.9,0.3
                    c0.2,0.2,0.4,0.4,0.7,0.7l20.9,22.1L81.7,6c2.3-3.6,7.5-4.8,11.6-2.8c4,2.1,5.5,6.7,3.1,10.3L45.2,92c-1.3,2.1-3.8,3.5-6.6,3.7
                    C38.4,95.7,38.2,95.7,37.9,95.7L37.9,95.7z"/>
            </g >

        </svg >
    )
}

export default CheckMark
