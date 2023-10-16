const Alert2 = ({
    width = "1em",
    height = "1em",
    className = '',
    fill = '#F47788'
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 33 33`}
            className={className}
            aria-label="Alert"
        >
            <circle fill={fill} cx="16" cy="16.1" r="16" />
            <g>
                <path fill="#FFFFFF" d="M18.5,25.7c0,0.4-0.3,0.6-0.6,0.6h-3.7c-0.4,0-0.6-0.3-0.6-0.6V22c0-0.4,0.3-0.6,0.6-0.6l3.7,0
                    c0.4,0,0.6,0.3,0.6,0.6V25.7z"/>
            </g>
            <g>
                <path fill="#FFFFFF" d="M18.6,18.2c0,0.4-0.3,0.7-0.6,0.7l-3.8,0c-0.4,0-0.6-0.3-0.6-0.7V6.7c0-0.4,0.3-0.7,0.6-0.7H18
                    c0.4,0,0.6,0.3,0.6,0.7C18.6,6.7,18.6,18.2,18.6,18.2z"/>
            </g>
        </svg >
    )
}

export default Alert2
