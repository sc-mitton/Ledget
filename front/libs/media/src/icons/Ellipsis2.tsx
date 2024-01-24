'react'

const Ellipsis = ({
    className = '',
    fill = "var(--icon-full)",
    width = "1.3em",
    height = "1.3em"
}) => {

    return (

        <svg
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="Ellipsis"
            className={className}
        >
            <circle fill={fill} cx="24.1" cy="72.2" r="9.3" />
            <path fill={fill} d="M71.6,81.5c-5.1,0-9.3-4.2-9.3-9.3s4.2-9.3,9.3-9.3c5.1,0,9.3,4.2,9.3,9.3S76.7,81.5,71.6,81.5z" />
            <circle fill={fill} cx="119.1" cy="72.2" r="9.3" />
        </svg>

    )
}

export default Ellipsis
