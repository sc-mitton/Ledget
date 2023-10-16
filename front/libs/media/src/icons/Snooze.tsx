import React from 'react'

const Snooze = ({
    width = "1em",
    height = "1em",
    className = '',
    fill = "#292929"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 144 144`}
            className={className}
            aria-label="Snooze"
        >
            <g>
                <path fill={fill} d="M0.1,143.6v-11.3L26.6,94H3.1V77.3h49.9v11.3L26.4,127h27.4v16.6H0.1z" />
            </g>
            <g>
                <path fill={fill} d="M79.9,79.2V65.5l31.9-46.1H83.6v-20h60.1V13l-32,46.1h33v20H79.9z" />
            </g>
        </svg >
    )
}

export default Snooze
