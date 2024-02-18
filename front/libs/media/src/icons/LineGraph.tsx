
const LineGraph = ({
    className = 'LineGraph-icon',
    fill = "currentColor",
    width = "1.75em",
    height = "1.75em"
}) => {

    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="LineGraph"
        >
            <g>
                <path fill={fill} d="M15.6,15.2c-0.6,0-1.2-0.2-1.7-0.7l-3.4-3.4c-0.5-0.5-1.5-0.5-2,0l-4.6,3.9c-0.2,0.2-0.5,0.1-0.7-0.1
                    c-0.2-0.2-0.1-0.5,0.1-0.7l4.6-3.9c0.8-0.8,2.4-0.9,3.3,0l3.4,3.4c0.5,0.5,1.5,0.5,2,0l4.5-3.9c0.2-0.2,0.5-0.2,0.7,0
                    s0.2,0.5,0,0.7l-4.5,3.9C16.8,15,16.2,15.2,15.6,15.2z"/>
            </g>
            <g>
                <circle fill={fill} cx="9.4" cy="10.2" r="1.2" />
            </g>
            <g>
                <path fill={fill} d="M3.6,15.9c-0.7,0-1.2-0.5-1.2-1.2s0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2S4.2,15.9,3.6,15.9z" />
            </g>
            <g>
                <path fill={fill} d="M15.6,15.9c-0.7,0-1.2-0.5-1.2-1.2s0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2S16.3,15.9,15.6,15.9z" />
            </g>
            <g>
                <circle fill={fill} cx="21.4" cy="10.2" r="1.2" />
            </g>
        </svg >
    )
}

export default LineGraph
