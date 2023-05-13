import React from 'react';

const FacebookLogo = ({
    width = "1.8em",
    height = "1.8em",
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
        xmlSpace="preserve">
        <path fill={'#039BE5'} d="M24,5C13.5,5,5,13.5,5,24s8.5,19,19,19s19-8.5,19-19S34.5,5,24,5z" />
        <path fill={'#FFFFFF'} d="M26.6,29h4.9l0.8-5h-5.7v-2.7c0-2.1,0.7-3.9,2.6-3.9h3.1V13c-0.5-0.1-1.7-0.2-3.9-0.2c-4.6,0-7.3,2.4-7.3,7.9V24h-4.7v5h4.7v13.7C22.1,42.9,23,43,24,43c0.9,0,1.7-0.1,2.6-0.2V29z" />
    </svg>
);

export default FacebookLogo;
