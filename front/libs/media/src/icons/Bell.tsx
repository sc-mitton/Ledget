'react'

const Bell = ({
    size = "1.5em",
    className = '',
    fill = "var(--icon-dark)",
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
                    margin: '0 auto',
                    fontSize: '12px',
                }}
            >
                {numberOfAlerts > 0 && (`${numberOfAlerts}`)}
            </span>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 144 144`}
                className={className}
                aria-label="Bell"
            >
                <path
                    fill={fill} d="M124.8,104.1c-1.8-2.5-6.5-7.1-6.5-7.1c-8.1-8.6-8.2-21.8-8.3-32.8c-0.1-7.8-1-15.7-3-23.3
                c-3-11.8-12.2-21.2-23.9-24.5c-1.3-0.4-2.1-1.5-2.1-2.8c0-4.5-3.8-8.1-8.4-7.8c-4.6-0.3-8.4,3.3-8.4,7.8c0,1.3-0.9,2.5-2.1,2.8
                c-11.7,3.4-20.8,12.7-23.9,24.5c-2,7.6-2.9,15.4-3,23.3c-0.2,11-0.2,24.2-8.3,32.8c0,0-4.8,4.6-6.5,7.1c-1.8,2.5-2.4,8.3,3.8,10.3
                c6.3,0,48.4,0,48.4,0s42.2,0,48.4,0C127.2,112.3,126.6,106.6,124.8,104.1z"/>
                <path fill={fill} d="M87.9,121.3c0,9.4-7.1,17.1-16,17.1s-16-7.6-16-17.1H87.9z" />
            </svg >
        </div>

    )
}

export default Bell
