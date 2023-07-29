import React from 'react'

import "./styles/LoadingRing.css"

const LoadingRing = ({ height, visible, children }) => {
    return (
        <div
            style={{
                position: 'relative',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: visible ? 'block' : 'none'
                }}
            >
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
            {children}
        </div>
    )
}

export default LoadingRing
