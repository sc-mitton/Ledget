
const Hourglass = ({
    className = 'hourglass-icon',
    stroke = "currentColor",
    width = "1em",
    height = "1em"
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
            aria-label="Location"
        >
            <line
                strokeWidth={1}
                stroke={stroke}
                fill='none'
                strokeLinecap="round" x1="4.2" y1="20.8" x2="19.8" y2="20.8"
            />
            <path
                strokeWidth={1}
                stroke={stroke}
                fill='none'
                strokeLinecap="round" d="M6.4,20.8c0-2.6,2.1-8.6,5.6-8.6s5.5,5.9,5.5,8.6H6.4z"
            />
            <line
                strokeWidth={1}
                stroke={stroke}
                fill='none'
                strokeLinecap="round" x1="19.8" y1="3.6" x2="4.2" y2="3.6"
            />
            <path
                strokeWidth={1}
                stroke={stroke}
                fill='none'
                strokeLinecap="round" d="M17.6,3.6c0,2.6-2.1,8.6-5.6,8.6S6.5,6.2,6.5,3.6H17.6z"
            />
            <path
                strokeWidth={1}
                stroke={stroke}
                fill={stroke}
                strokeLinecap="round"
                d="M16,9.1c-1,1.7-2.3,3.1-4,3.1c-1.7,0-3-1.4-4-3.1L16,9.1z"
            />
        </svg >
    )
}

export default Hourglass
