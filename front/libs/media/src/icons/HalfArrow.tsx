
const Hamburger = ({
    className = '',
    size = "1em",
    stroke = "var(--icon-full)",
    strokeWidth = "20"
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
        >
            <polyline
                fill={'none'}
                stroke={stroke}
                strokeLinecap="round"
                strokeWidth={strokeWidth}
                points="82.1,40 127.1,85 16.9,85 "
            />
        </svg>
    )
}

export default Hamburger
