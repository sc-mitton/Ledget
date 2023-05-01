import React from 'react'

const Profile = ({
    className = null,
    width = "2em",
    height = "2em",
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
        >
            <path fill={fill} d="M106.1,101.7H72H38c-2,0-3.6-1.7-3.3-3.7c0.3-2.7,1.1-6.6,2.8-10c4.1-7.2,19.5-11,23-12.3s4.2-2.8,4.2-6.3
	C61,65.3,55.9,50.9,59,41.3c1.6-4.8,6-9.2,13-9.2c6.7,0,11.5,4.4,13,9.2c3.2,9.5-2,24-5.7,28.1c-0.1,3.6,0.7,5.1,4.2,6.3
	c3.5,1.3,18.9,5.1,23,12.3c1.8,3.4,2.5,7.2,2.8,10C109.6,100,108.1,101.7,106.1,101.7z"/>
            <circle stroke={fill} strokeWidth="8" fill="none" cx="71.7" cy="70.6" r="62.2" />
        </svg>

    )
}

export default Profile
