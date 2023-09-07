import React from 'react';

import './pieces.css'

export const ExpandableContainer = ({ expanded, children }) => (
    <div className={`animated-container ${expanded ? 'expanded' : 'collapsed'}`}>
        {children}
    </div>
)

export const LoadingRing = ({ height, color = 'light', visible, children }) => {
    return (
        <div
            style={{
                position: 'relative',
                color: 'inherit',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: visible ? 'block' : 'none',
                    color: 'inherit',
                }}
            >
                <div className={`lds-ring ${color}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            {children}
        </div>
    )
}

