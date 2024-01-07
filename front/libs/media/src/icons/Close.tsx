'react'

const Close = ({
    className = '',
    size = ".7em",
    stroke = "var(--icon-full)",
    strokeWidth = "22"
}) => {

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label='close'
        >
            <line
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeLinejoin='round'
                x1="18.2"
                y1="125.8"
                x2="125.8"
                y2="18.2"
            />
            <line
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeLinejoin='round'
                x1="125.8"
                y1="125.8"
                x2="18.2"
                y2="18.2"
            />

        </svg>
    )
}

export default Close
