'react'

const Expand = ({
    className = '',
    size = ".7em",
    stroke = "#FFFFFF",
    strokeWidth = "18",
    ...rest
}) => {

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="72px"
            y="72px"
            aria-label="Expand or collapse"
            className={className}
            {...rest}
        >
            <polyline
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeLinejoin='round'
                points="129.62,121.73 71.97,73.03 14.47,121.58 "
            />
            <polyline
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeLinejoin='round'
                points="129.62,70.25 71.97,21.56 14.47,70.11 "
            />
        </svg>
    )
}

export default Expand
