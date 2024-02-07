'react'

const Refresh = ({
    className = '',
    size = "1.375em",
    stroke = "var(--icon-full)",
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
            aria-label="resend"
            style={{
                width: size,
                height: size,
            }}
        >
            <path fill='none' stroke={stroke} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" d="M103.8,56.9c4.2,6.2,6.6,13.6,6.6,21.6c0,21.3-17.2,38.6-38.6,38.6S33.2,99.8,33.2,78.5s17.3-38.6,38.6-38.6 H89" />
            <polyline fill='none' stroke={stroke} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" points="68.8,19.6 89,39.9 68.8,60.1" />
        </svg>

    )
}

export default Refresh
