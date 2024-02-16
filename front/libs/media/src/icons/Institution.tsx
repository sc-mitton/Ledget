
const Institution = ({
    className = 'institution-icon',
    stroke = "currentColor",
    strokeWidth = 1.5,
    width = "1.25em",
    height = "1.25em"
}) => {

    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="Institution"
        >
            <line
                fill='none'
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                stroke={stroke} x1="12.5" y1="11.5" x2="12.5" y2="22"
            />
            <line
                fill='none'
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                stroke={stroke} x1="20.5" y1="11.5" x2="20.5" y2="22"
            />
            <line
                fill='none'
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                stroke={stroke} x1="4.6" y1="11.5" x2="4.6" y2="22"
            />
            <path
                fill='none'
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                stroke={stroke} d="M12.1,3.1L2.6,6.9C1.6,7.3,1.9,8.8,3,8.8h19c1.1,0,1.4-1.5,0.4-1.9l-9.5-3.8C12.6,3,12.4,3,12.1,3.1z"
            />
        </svg >
    )
}

export default Institution
