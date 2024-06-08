

const Ellipsis = ({
    className = '',
    fill = "var(--icon-full)",
    size = "1.2em",
    rotate = 0
}) => {

    return (

        <svg
            className={className}
            transform={`rotate(${rotate})`}
            width={size}
            height={size}
            fill={fill}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="Ellipsis"
        >
            <path fill={fill} d="M72,82.4c-5.7,0-10.4-4.7-10.4-10.4S66.3,61.6,72,61.6S82.4,66.3,82.4,72S77.7,82.4,72,82.4z" />
            <path fill={fill} d="M72,37.2c-5.7,0-10.4-4.7-10.4-10.4c0-5.7,4.7-10.4,10.4-10.4s10.4,4.7,10.4,10.4C82.4,32.6,77.7,37.2,72,37.2z
                "/>
            <path fill={fill} d="M72,127.6c-5.7,0-10.4-4.7-10.4-10.4s4.7-10.4,10.4-10.4s10.4,4.7,10.4,10.4S77.7,127.6,72,127.6z" />
        </svg>

    )
}

export default Ellipsis
