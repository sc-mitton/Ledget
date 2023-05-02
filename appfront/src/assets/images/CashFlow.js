import React from 'react'

const CashFlow = ({
    className = null,
    width = "1.3em",
    height = "1.3em",
    fill = "#464646",
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
            aria-label='cash flow'
        >
            <path fill={fill} d="M95.5,39.1h40.3c1.3,0,2.4-1.1,2.4-2.4V22.5c0-1.3-1.1-2.4-2.4-2.4H95.5C77.4,20.1,69,28,62.8,33.8
	c-5.1,4.8-8.1,7.7-16.7,7.7H6.5c-1.3,0-2.4,1.1-2.4,2.4V60H4V79h0.1v16.1c0,1.3,1.1,2.4,2.4,2.4h37.2c10.6,0,14.2,3.4,19.6,8.5
	c6.1,5.7,13.6,12.8,29.7,12.8h42.7c1.3,0,2.4-1.1,2.4-2.4v-14.3c0-1.3-1.1-2.4-2.4-2.4H93.1c-8.5,0-11.6-2.9-16.7-7.7
	C71.2,87.3,64.4,80.9,51.3,79h84.5c1.3,0,2.4-1.1,2.4-2.4V62.3c0-1.3-1.1-2.4-2.4-2.4H53.2c11.4-1.7,17.6-7.5,22.7-12.3
	C81.3,42.5,84.9,39.1,95.5,39.1z"/>
        </svg>

    )
}

export default CashFlow
