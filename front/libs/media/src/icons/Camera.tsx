'react'

const Camera = ({
    className = '',
    width = "1em",
    height = "1em",
    fill = "var(--icon-dark)"
}) => {

    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 288 288"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label='Camera icon'
        >
            <g>
                <g>

                    <ellipse fill={fill} transform="matrix(0.3827 -0.9239 0.9239 0.3827 -60.0838 232.3633)" cx="143.8" cy="161.1" rx="26.2" ry="26.2" />
                </g>
                <g>
                    <path fill={fill} d="M257.7,78.5h-62l-7.9-18.2c-1.6-5.2-4.2-9.5-9.5-9.5h-68.8c-5.2,0-7.7,4-9.5,9.5l-7.9,18.2H67.4V74
                        c0-6.1-5-11.1-11.1-11.1h-9.1c-6.1,0-11.1,5-11.1,11.1v4.5h-5.8c-10.2,0-18.5,8.3-18.5,18.5v121.7c0,10.2,8.3,18.5,18.5,18.5
                        h227.4c10.2,0,18.5-8.3,18.5-18.5V97C276.2,86.8,267.9,78.5,257.7,78.5z M143.8,210c-27,0-48.9-21.9-48.9-48.9
                        c0-27,21.9-48.9,48.9-48.9c27,0,48.9,21.9,48.9,48.9C192.7,188.1,170.8,210,143.8,210z"/>
                </g>
            </g>
        </svg>
    )
}

export default Camera
