import React from 'react'

const Location = ({
    className = 'location-icon',
    fill = "#292929",
    width = "1em",
    height = "1em"
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
            aria-label="Location"
        >
            <g>
                <path fill={fill} d="M71.9,9.1c-26.7,0-48.4,21.7-48.4,48.4c0,20.7,24,49.5,42,73.9c3.4,4.6,9.4,4.7,12.7,0c19.8-27.9,40.6-53.7,42-73.9
                    C122.3,30.9,98.7,9.1,71.9,9.1z M71.5,70.3c-10.3,0-18.7-8.4-18.7-18.7c0-10.3,8.4-18.7,18.7-18.7c10.3,0,18.7,8.4,18.7,18.7
                    C90.2,61.9,81.8,70.3,71.5,70.3z"/>
            </g>
        </svg >
    )
}

export default Location
