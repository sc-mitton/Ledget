const ThumbUp = ({
    className = '',
    width = "1em",
    height = "1em",
    fill = "#292929",
    rotate = 0,
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
            aria-label="thumb-up"
            transform={`rotate(${rotate})`}
        >
            <path fill={fill} d="M26.4,60.7H14.7c-2.8,0-5.1,2.3-5.1,5.1v56.3c0,2.8,2.3,5.1,5.1,5.1h11.7c2.8,0,5.1-2.3,5.1-5.1V65.8
        	C31.4,63,29.2,60.7,26.4,60.7z"/>
            <path fill={fill} d="M107.1,127.2H50.9c-4.6,0-8.3-3.7-8.3-8.3V66.7c0-4.6,4.1-8.2,7.3-10.5L82.1,19c2.6-2.6,6.8-2.5,9.3,0.2
        	l1.7,1.8c1.5,1.6,2,3.8,1.6,5.9l-5.3,26.3c-0.5,2,1.1,4,3.2,4h4.3h29.2c4.6,0,8.3,3.7,8.3,8.3v11c0,2.5-0.5,4.9-1.6,7.1l-18.2,38.8
        	C113.2,125.3,110.3,127.2,107.1,127.2z"/>
        </svg>
    )
}

export default ThumbUp
