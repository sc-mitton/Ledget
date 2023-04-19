import React from 'react'

const Arrow = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 30 27">
            <g transform="translate(11, 8) scale(1.7) rotate(90) translate(-12, -12)">
                <path
                    className="path"
                    d="M15 15L20 10L15 5"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill="none"
                />
                <path
                    className="path"
                    d="M15 5L20 10L15 15"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                />
            </g>
        </svg >
    )
}

export default Arrow
