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
            <path fill={fill} d="M16,0.1c-8.8,0-16,7.2-16,16s7.2,16,16,16s16-7.2,16-16S24.8,0.1,16,0.1z M18.5,25.7c0,0.4-0.3,0.6-0.6,0.6
                    h-3.7c-0.4,0-0.6-0.3-0.6-0.6V22c0-0.4,0.3-0.6,0.6-0.6h3.7c0.4,0,0.6,0.3,0.6,0.6V25.7z M18.6,18.2c0,0.4-0.3,0.7-0.6,0.7h-3.8
                    c-0.4,0-0.6-0.3-0.6-0.7V6.7c0-0.4,0.3-0.7,0.6-0.7H18c0.4,0,0.6,0.3,0.6,0.7V18.2z"/>
        </svg >
    )
}

export default Alert2
