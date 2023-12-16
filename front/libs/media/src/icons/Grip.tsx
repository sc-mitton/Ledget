'react'

const Grip = ({
    width = "1em",
    height = "1em",
    className = '',
    fill = "var(--icon-full)",
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 144 144`}
            className={className}
            aria-label="Grip"
        >
            <g>
                <circle fill={fill} cx="97.2" cy="29.8" r="13.2" />
            </g>
            <g>
                <circle fill={fill} cx="97.2" cy="72" r="13.2" />
            </g>
            <g>
                <circle fill={fill} cx="97.2" cy="114.2" r="13.2" />
            </g>
            <g>
                <circle fill={fill} cx="43.6" cy="29.8" r="13.2" />
            </g>
            <g>
                <circle fill={fill} cx="43.6" cy="72" r="13.2" />
            </g>
            <g>
                <circle fill={fill} cx="43.6" cy="114.2" r="13.2" />
            </g>
        </svg >
    )
}

export default Grip
