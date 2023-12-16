'react'

const Shield = ({
    width = "1em",
    height = "1em",
    className = '',
    fill = "var(--icon-full)"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 144 144`}
            className={className}
            aria-label="Shield"
        >
            <path fill={fill} d="M129.4,32.4c-1.1,82.8-48.9,103.6-56.4,106.3c-0.6,0.2-1.3,0.2-2,0c-7.5-2.5-55.3-21.7-56.4-106.3c0-1.6,1.3-3,2.9-3.1
               c20.3-0.7,38.7-9.1,52.4-22.2c1.2-1.1,3-1.1,4.2,0c13.7,13.2,32.1,21.5,52.4,22.2C128.1,29.4,129.4,30.7,129.4,32.4z"/>
        </svg >
    )
}

export default Shield
