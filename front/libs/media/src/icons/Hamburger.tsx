
const Hamburger = ({
    className = '',
    size = "1em",
    stroke = "var(--icon-full)",
    strokeWidth = "16"
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
            aria-label='hambuger menu'
        >
            <line
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                x1="123.1" y1="48" x2="20.9" y2="48"
            />
            <line
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                x1="123.1" y1="96" x2="20.9" y2="96"
            />
        </svg>
    )
}

export default Hamburger
