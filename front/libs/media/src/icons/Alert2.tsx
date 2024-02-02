const Alert2 = ({
    width = "1em",
    height = "1em",
    className = '',
    fill = 'var(--alert-red)',
    fill2 = 'var(--white)'
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 33 33`}
            className={className}
            aria-label="Alert"
        >
            <path fill={fill} d="M16,0.1c-8.8,0-16,7.2-16,16s7.2,16,16,16s16-7.2,16-16S24.8,0.1,16,0.1z" />
            <circle fill={fill2} cx="16" cy="24.9" r="2.1" />
            <line stroke={fill2} strokeWidth={3} strokeLinecap="round" x1="16" y1="18.5" x2="16" y2="6.9" />
        </svg >
    )
}

export default Alert2
