'react'

const Refresh = ({
    className = '',
    size = "1.125em",
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
            <path fill='none' stroke={stroke} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" d="M107.6,55.5c4.7,6.9,7.4,15.2,7.4,24.2c0,23.8-19.3,43.2-43.2,43.2s-43.2-19.3-43.2-43.2S48,36.5,71.8,36.5h19.3" />
            <polyline fill='none' stroke={stroke} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" points="68.4,13.8 91.1,36.5 68.4,59.1" />
        </svg>

    )
}

export default Refresh
