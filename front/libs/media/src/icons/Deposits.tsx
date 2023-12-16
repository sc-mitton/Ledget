'react'

const Deposits = ({
    width = "1.4em",
    height = "1.4em",
    className = '',
    fill = "var(--icon-full)",
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            fill={fill}
            aria-label='deposits'
            className={className}
        >
            <g>
                <path fill={fill} d="M136.3,90.1l0-36.1c0-7.9-6.4-14.4-14.4-14.4H22.1c-7.9,0-14.4,6.4-14.4,14.4v36.1c0,7.9,6.4,14.4,14.4,14.4
                    h99.8C129.9,104.4,136.3,98,136.3,90.1z M60.2,83.8c-6.5-6.5-6.5-17,0-23.5s17-6.5,23.5,0c6.5,6.5,6.5,17,0,23.5
                    C77.3,90.3,66.7,90.3,60.2,83.8z"/>
            </g>
        </svg>
    )
}

export default Deposits
