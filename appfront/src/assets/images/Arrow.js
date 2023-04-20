import React from 'react'

const Arrow = ({
    stroke = 'rgb(36, 36, 36)',
    scale = 1,
    rotation = 0,
    strokeWidth = 3,
    width = 24,
    height = 24,
}) => {
    const centerX = width / 2
    const centerY = height / 2

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <g transform={
                `translate(${centerX}, ${centerY})
                scale(${scale})
                rotate(${rotation})
                translate(-${centerX}, -${centerY})`
            }>
                <path
                    className="path"
                    d="M3 8 L12 18 L21 8"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill="none"
                />
            </g>
        </svg >
    )
}

export default Arrow
