const Arrow = ({
    stroke = 'var(--icon-full)',
    scale = 1,
    rotation = 0,
    strokeWidth = "22",
    size = '1.1em',
    syle = {}
}) => {
    const centerX = 144 / 2
    const centerY = 144 / 2

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${144} ${144}`}
            aria-label="Double Arrow"
            style={syle}
        >
            <g transform={
                `translate(${centerX}, ${centerY})
                scale(${scale})
                rotate(${rotation})
                translate(-${centerX}, -${centerY})`
            }>
                <polyline
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill="none"
                    points="124.9,78 72,131 19.1,78 "
                />
                <polyline
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill="none"
                    points="124.9,12 72,65 19.1,12 "
                />
            </g>
        </svg >
    )
}

export default Arrow
