import React from 'react'

const Bell = ({
    width = "1.5em",
    height = "1.5em",
    className = null,
    fill = "#292929",
    numberOfAlerts = 0,
    color = "var(--white-text)"
}) => {

    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <span
                style={{
                    color: color,
                    position: 'absolute',
                    top: '1px',
                    right: '7.5px',
                    fontSize: '12px',
                }}
            >
                {numberOfAlerts > 0 && (`${numberOfAlerts}`)}
            </span>
            <svg
                width={width}
                height={height}
                viewBox={`0 0 144 144`}
                className={className}
                aria-label="Bell"
            >
                <path fill={fill} d="M87.9,121.3c0,9.4-7.1,17.1-16,17.1s-16-7.6-16-17.1C55.9,121.3,87.9,121.3,87.9,121.3z" />
                <line
                    stroke={fill}
                    strokeWidth="10"
                    strokeLinecap='round'
                    x1="33.2" y1="9.8" x2="112" y2="134.2"
                />
                <g>
                    <path fill={fill} d="M39.6,36.7c-0.5,1.4-1,2.7-1.4,4.2c-2,7.6-2.9,15.4-3,23.3C35,75.2,35,88.4,26.9,97c0,0-4.8,4.6-6.5,7.1
                        c-1.8,2.5-2.4,8.3,3.8,10.3c6.3,0,48.4,0,48.4,0s7.3,0,16.2,0L39.6,36.7z"/>
                    <path fill={fill} d="M124.8,104.1c-1.8-2.5-6.5-7.1-6.5-7.1c-8.1-8.6-8.2-21.8-8.3-32.8c-0.1-7.8-1-15.7-3-23.3
                        c-3-11.8-12.2-21.2-23.9-24.5C81.8,16,81,14.9,81,13.6c0-4.5-3.8-8.1-8.4-7.8c-4.6-0.3-8.4,3.3-8.4,7.8c0,1.3-0.9,2.5-2.1,2.8
                        c-3.9,1.1-7.5,2.9-10.7,5.3l58.8,92.7c5.2,0,9.3,0,10.9,0C127.2,112.3,126.6,106.6,124.8,104.1z"/>
                </g>
            </svg >
        </div>

    )
}

export default Bell
