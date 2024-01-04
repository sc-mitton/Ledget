'react'

const Split = ({
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
        >
            <path fill={fill} d="M52.2,104.2H14.3C8.6,104.2,4,99.6,4,93.9V50.4c0-5.7,4.6-10.3,10.3-10.3h37.9c5.7,0,10.3,4.6,10.3,10.3v43.5
            C62.5,99.6,57.9,104.2,52.2,104.2z"/>
            <path fill={fill} d="M91,40.2h37.9c5.7,0,10.3,4.6,10.3,10.3V94c0,5.7-4.6,10.3-10.3,10.3H91c-5.7,0-10.3-4.6-10.3-10.3V50.5
            C80.7,44.8,85.3,40.2,91,40.2z"/>
        </svg >
    )
}

export default Split
