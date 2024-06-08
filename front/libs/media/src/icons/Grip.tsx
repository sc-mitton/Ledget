

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
                <path fill={fill} d="M97.2,39c-5.1,0-9.2-4.1-9.2-9.2c0-5.1,4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2C106.4,34.9,102.3,39,97.2,39z" />
            </g>
            <g>
                <circle fill={fill} cx="97.2" cy="72" r="9.2" />
            </g>
            <g>
                <circle fill={fill} cx="97.2" cy="114.2" r="9.2" />
            </g>
            <g>
                <path fill={fill} d="M43.6,39c-5.1,0-9.2-4.1-9.2-9.2c0-5.1,4.1-9.2,9.2-9.2c5.1,0,9.2,4.1,9.2,9.2C52.8,34.9,48.7,39,43.6,39z" />
            </g>
            <g>
                <path fill={fill} d="M43.6,81.2c-5.1,0-9.2-4.1-9.2-9.2s4.1-9.2,9.2-9.2c5.1,0,9.2,4.1,9.2,9.2S48.7,81.2,43.6,81.2z" />
            </g>
            <g>
                <path fill={fill} d="M43.6,123.4c-5.1,0-9.2-4.1-9.2-9.2s4.1-9.2,9.2-9.2c5.1,0,9.2,4.1,9.2,9.2S48.7,123.4,43.6,123.4z" />
            </g>
        </svg >
    )
}

export default Grip
