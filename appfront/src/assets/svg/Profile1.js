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
            aria-label="Profile"
        >
            <path d="M108.1,103.5H72h-36c-2.1,0-3.8-1.8-3.5-3.9c0.3-2.9,1.2-7,3-10.6c4.3-7.6,20.6-11.6,24.3-13
    c3.7-1.4,4.4-3,4.4-6.7c-3.9-4.3-9.3-19.6-6-29.7c1.7-5.1,6.3-9.7,13.7-9.7c7.1,0,12.2,4.7,13.7,9.7c3.4,10-2.1,25.4-6,29.7
    c-0.1,3.8,0.7,5.4,4.4,6.7c3.7,1.4,20,5.4,24.3,13c1.9,3.6,2.6,7.6,3,10.6C111.8,101.7,110.2,103.5,108.1,103.5z"/>
            <circle stroke={fill} strokeWidth="8" fill="none" cx="72" cy="72" r="67.5" />
        </svg>

    )
}

export default Profile
