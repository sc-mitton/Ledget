'react'

const SmsAuth = ({
    width = "1em",
    height = "1em",
    className = '',
    fill = 'var(--icon-full)',
    fill2 = 'var(--blue-dark)'
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 144 144`}
            className={className}
            aria-label="Sms Verification"
        >
            <path fill={fill} d="M101,30.3H43c-15.2,0-27.6,12.3-27.6,27.6v18.6c0,12.9,8.9,23.7,20.9,26.7v16.1c0,3.2,3.9,4.8,6.2,2.6
                l17.8-17.8H101c15.2,0,27.6-12.3,27.6-27.6V57.9C128.6,42.7,116.2,30.3,101,30.3z"/>
            <circle fill={fill2} cx="40.7" cy="69.3" r="5.9" />
            <circle fill={fill2} cx="61.6" cy="69.3" r="5.9" />
            <circle fill={fill2} cx="82.5" cy="69.3" r="5.9" />
            <circle fill={fill2} cx="103.4" cy="69.3" r="5.9" />
        </svg >
    )
}

export default SmsAuth
