const Delete = ({
    className = '',
    size = "1em",
    stroke = "var(--m-text)",
    strokeWidth = "10",
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
                <line stroke={stroke} strokeWidth={strokeWidth} x1="30.3" y1="72" x2="113.7" y2="72" />
                <line stroke={stroke} strokeWidth={strokeWidth} x1="72" y1="30.3" x2="72" y2="113.7" />

            </svg>
        </>
    )
}

export default Delete
