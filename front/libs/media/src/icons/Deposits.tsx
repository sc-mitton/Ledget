

const Deposits = ({
    width = "1.4em",
    height = "1.4em",
    className = '',
    stroke = "var(--icon-full)",
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label='deposits'
            className={className}
        >
            <g>
                <path strokeWidth={9} stroke={stroke} fill='none' d="M136.3,90.1V54c0-7.9-6.4-14.4-14.4-14.4H22.1C14.2,39.6,7.7,46,7.7,54v36.1c0,7.9,6.4,14.4,14.4,14.4h99.8
                C129.9,104.4,136.3,98,136.3,90.1z M60.2,83.8c-6.5-6.5-6.5-17,0-23.5s17-6.5,23.5,0s6.5,17,0,23.5C77.3,90.3,66.7,90.3,60.2,83.8z
                "/>
            </g>
        </svg>
    )
}

export default Deposits
