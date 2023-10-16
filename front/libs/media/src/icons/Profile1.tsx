import React from 'react'

const Profile = ({
    className = '',
    width = "1.8em",
    height = "1.8em",
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
            aria-label="Profile"
        >
            <path fill={fill} d="M72,2.5C33.6,2.5,2.5,33.6,2.5,72s31.1,69.5,69.5,69.5s69.5-31.1,69.5-69.5S110.4,2.5,72,2.5z M106.4,102H72
            H37.7c-2,0-3.6-1.7-3.3-3.7c0.3-2.8,1.1-6.7,2.9-10.1c4.1-7.2,19.6-11,23.1-12.4c3.5-1.3,4.2-2.9,4.2-6.4
            c-3.7-4.1-8.9-18.7-5.7-28.3c1.6-4.9,6-9.2,13-9.2c6.8,0,11.6,4.5,13,9.2c3.2,9.5-2,24.2-5.7,28.3c-0.1,3.6,0.7,5.1,4.2,6.4
            s19,5.1,23.1,12.4c1.8,3.4,2.5,7.2,2.9,10.1C109.9,100.3,108.4,102,106.4,102z"/>
        </svg>

    )
}

export default Profile
