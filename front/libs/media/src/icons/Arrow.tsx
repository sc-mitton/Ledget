const Arrow = ({
    stroke = 'rgb(36, 36, 36)',
    scale = 1,
    rotation = 0,
    strokeWidth = "23",
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
            aria-label="Arrow"
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
                    points="124.9,49.5 72,102.5 19.1,49.5 "
                />
            </g>
        </svg >
    )
}

export default Arrow
