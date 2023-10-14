import React from 'react';

const FacebookLogo = ({
    width = "1.3em",
    height = "1.3em",
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
        aria-label="Facebook Logo"
    >
        <path fill={'#000000'} d="M24,0.5C11,0.5,0.5,11,0.5,24S11,47.5,24,47.5S47.5,37,47.5,24S37,0.5,24,0.5z" />
        <path fill={'#FFFFFF'} d="M27.2,30.2h6.1l1-6.2h-7v-3.3c0-2.6,0.9-4.8,3.2-4.8h3.8v-5.4c-0.6-0.1-2.1-0.2-4.8-0.2c-5.7,0-9,3-9,9.8V24
	h-5.8v6.2h5.8v16.9c1.2,0.2,2.3,0.4,3.6,0.4c1.1,0,2.1-0.1,3.2-0.2V30.2z"/>
    </svg>
);

export default FacebookLogo;
