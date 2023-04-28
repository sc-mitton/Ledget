import React from 'react'

const Arrow = ({
    stroke = 'rgb(36, 36, 36)',
    scale = 1,
    rotation = 0,
    strokeWidth = "23",
    width = "1.1em",
    height = "1.1em",
}) => {
    const centerX = 144 / 2
    const centerY = 88 / 2

    return (
        <svg width={width} height={height} viewBox={`0 0 ${144} ${88}`}>
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
                    points="131.28,15.05 72,74.32 12.72,15.05 "
                />
            </g>
        </svg >
    )
}

export default Arrow
