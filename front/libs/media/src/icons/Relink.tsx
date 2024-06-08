

const Relink = ({
    className = '',
    width = "1.3em",
    height = "1.3em",
    stroke = "currentColor",
    strokeWidth = 10,
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="relink"
        >
            <path
                fill='none'
                stroke={stroke}
                d="M82.3,42.8h24.5c15.4,0,27.8,12.5,27.8,27.8v6.7c0,15.4-12.5,27.8-27.8,27.8H37.2c-15.4,0-27.8-12.5-27.8-27.8
	            v-6.7c0-15.4,12.5-27.8,27.8-27.8h11.3"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <polyline
                fill='none'
                stroke={stroke}
                points="98.8,63.6 78,42.8 98.8,21.9 "
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    )
}

export default Relink
