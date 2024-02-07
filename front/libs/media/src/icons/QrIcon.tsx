'react'

const QrIcon = ({
    width = "1em",
    height = "1em",
    className = '',
    stroke = "var(--icon-full)"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 144 144`}
            className={className}
            aria-label="Qr Icon"
        >
            <path stroke={stroke} fill='none' strokeWidth={8} strokeLinecap="round" d="M120.4,62.8H87.5c-3.5,0-6.4-2.8-6.4-6.4V23.5c0-3.5,2.8-6.4,6.4-6.4h32.9c3.5,0,6.4,2.8,6.4,6.4v32.9
                C126.7,59.9,123.9,62.8,120.4,62.8z"/>
            <path stroke={stroke} fill='none' strokeWidth={8} strokeLinecap="round" d="M56.6,62.8H23.7c-3.5,0-6.4-2.8-6.4-6.4V23.5c0-3.5,2.8-6.4,6.4-6.4h32.9c3.5,0,6.4,2.8,6.4,6.4v32.9
                C62.9,59.9,60.1,62.8,56.6,62.8z"/>
            <path stroke={stroke} fill='none' strokeWidth={8} strokeLinecap="round" d="M105.6,81.2h14.7c3.1,0,5.7,2.7,5.7,6V118" />
            <path stroke={stroke} fill='none' strokeWidth={8} strokeLinecap="round" d="M103.1,126.8H87.5c-3.1,0-5.7-2.7-5.7-6V90" />
            <path stroke={stroke} fill='none' strokeWidth={8} strokeLinecap="round" d="M56.6,126.8H23.7c-3.5,0-6.4-2.8-6.4-6.4V87.6c0-3.5,2.8-6.4,6.4-6.4h32.9c3.5,0,6.4,2.8,6.4,6.4v32.9
                C62.9,124,60.1,126.8,56.6,126.8z"/>
            <path stroke={stroke} fill='none' strokeWidth={8} strokeLinecap="round" d="M109.8,112.1H98c-1.3,0-2.3-1-2.3-2.3V98.2c0-1.3,1-2.3,2.3-2.3h11.7c1.3,0,2.3,1,2.3,2.3v11.7
                C112,111.1,111,112.1,109.8,112.1z"/>
        </svg >
    )
}

export default QrIcon
