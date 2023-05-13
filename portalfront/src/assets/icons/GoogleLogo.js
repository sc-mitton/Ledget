import React from 'react';

const GoogleLogo = ({
    width = "1.7em",
    height = "1.7em",
}) => (
    <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width={width}
        height={height}
        viewBox="0 0 48 48"
        style={{ enableBackground: 'new 0 0 48 48' }}
        xmlSpace="preserve"
    >
        <path fill={'#FFC107'} d="M43.6,20.1H42V20H24v8h11.3c-1.6,4.7-6.1,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.8,1.2,8,3l5.7-5.7
    C34,6.1,29.3,4,24,4C13,4,4,13,4,24s9,20,20,20s20-9,20-20C44,22.7,43.9,21.4,43.6,20.1z"/>
        <path fill={'#FF3D00'} d="M6.3,14.7l6.6,4.8C14.7,15.1,19,12,24,12c3.1,0,5.8,1.2,8,3l5.7-5.7C34,6.1,29.3,4,24,4
    C16.3,4,9.7,8.3,6.3,14.7z"/>
        <path fill={'#4CAF50'} d="M24,44c5.2,0,9.9-2,13.4-5.2l-6.2-5.2c-2,1.5-4.5,2.4-7.2,2.4c-5.2,0-9.6-3.3-11.3-7.9l-6.5,5
    C9.5,39.6,16.2,44,24,44z"/>
        <path fill={'#1976D2'} d="M43.6,20.1H42V20H24v8h11.3c-0.8,2.2-2.2,4.2-4.1,5.6c0,0,0,0,0,0l6.2,5.2C37,39.2,44,34,44,24
    C44,22.7,43.9,21.4,43.6,20.1z"/>
    </svg>
)

export default GoogleLogo;
