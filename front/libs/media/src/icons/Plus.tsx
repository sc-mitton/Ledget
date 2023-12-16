'react'

const Plus = ({
    className = '',
    size = "1.2em",
    stroke = "var(--icon-full)",
    strokeWidth = "18"
}) => {

    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label='plus'
        >
            <line
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                x1="72" y1="19.91" x2="72" y2="124.09"
            />
            <line
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                x1="19.91" y1="72" x2="124.09" y2="72"
            />
        </svg>
    )
}

export default Plus
