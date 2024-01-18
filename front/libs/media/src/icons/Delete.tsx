const Delete = ({
    className = '',
    size = "1em",
    stroke = "var(--m-text)",
    strokeWidth = "12",
    border = 'var(--input-border-color)'
}) => {

    return (
        <>
            <svg
                className={className}
                width={size}
                height={size}
                viewBox="0 0 144 144"
                xmlns="http://www.w3.org/2000/svg"
                strokeLinecap="round"
                x="0px"
                y="0px"
                aria-label="Delete"
            >
                <line stroke={stroke} strokeWidth={strokeWidth} x1="40.3" y1="72" x2="103.7" y2="72" />
                <line stroke={stroke} strokeWidth={strokeWidth} x1="72" y1="40.3" x2="72" y2="103.7" />
            </svg>
        </>
    )
}

export default Delete
