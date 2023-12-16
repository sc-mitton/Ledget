'react'

const Return = ({
    stroke = 'var(--icon-full)',
    strokeWidth = "20",
    width = "1.1em",
    height = "1.1em",
}) => {
    const centerX = 144 / 2
    const centerY = 144 / 2

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${144} ${144}`}
            aria-label="Return"
        >
            <polyline
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill='none'
                points="126.8,16.8 126.8,95.8 18.6,95.8 "
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <polyline
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill='none'
                points="43.2,127.9 11.1,95.8 43.2,63.6 "
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg >
    )
}

export default Return
