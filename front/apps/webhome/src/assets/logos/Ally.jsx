import React from 'react'

const Ally = ({
        className = null,
        width = "1.8em",
        height = "1.8em",
        fill = "#3E154A",
}) => {
        return (
                <svg
                        className={className}
                        width={width}
                        height={height}
                        viewBox="0 0 288 144"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        aria-label='Ally Bank Logo'
                >
                        <path fill={fill} d="M35.4,0h217.2c19.8,0,35.8,16,35.8,35.8v72.5c0,19.8-16,35.8-35.8,35.8H35.4c-19.8,0-35.8-16-35.8-35.8V35.8
                                C-0.4,16,15.6,0,35.4,0z"/>
                        <g>
                                <path fill="#FFFFFF" d="M125,27.5h15.6v69.7H125V27.5z" />
                                <path fill="#FFFFFF" d="M148.1,27.5h15.6v69.7h-15.6V27.5z" />
                                <path fill="#FFFFFF" d="M221.9,46.8l-26.2,69.7h-16.6l8.3-20.1l-19.4-49.6h16.7l10.5,30.3h0.2l10-30.3H221.9z" />
                                <g>
                                        <path fill="#FFFFFF" d="M117.9,72.2c0-11.8-8.4-25.6-25.9-25.6c-17.5,0-25.9,13.8-25.9,25.6c0,11.2,7.6,24.2,23.5,25.5l13.4-14.5
                                                H92.2c-6.1,0-11.3-4.6-11.3-11c0-6.4,5.2-11,11.3-11c6.1,0,11.3,4.6,11.3,11c0,5.9,0,19.3,0,24.6h14.4
                                                C117.9,90.3,117.9,77.9,117.9,72.2z"/>
                                </g>
                        </g>
                </svg>
        )
}

export default Ally
