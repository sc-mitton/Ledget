import React from 'react';

import './styles/pieces.css'
import { Alert2 } from '@ledget/shared-assets'

export const ExpandableContainer = ({ expanded, children }) => (
    <div className={`animated-container ${expanded ? 'expanded' : 'collapsed'}`}>
        {children}
    </div>
)

export const LoadingRing = ({ height, color = 'light', visible, children }) => {
    return (
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
    )
}

export const FormErrorTip = ({ errors }) => {

    return (
        <>
            {
                errors.some((error) => error?.type === 'required' || error?.message === 'required') &&
                <div className='error-tip'>
                    <Alert2 />
                </div>
            }
        </>
    )
}

export const FormError = (props) => {
    const renderLines = (text) => {
        const lines = text.split('\n')
        return lines.map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>)
    }

    return (
        <>
            {props.msg && !props.msg?.includes('required') &&
                <div className="form-error--container">
                    <Alert2 />
                    <div className="form-error">
                        {renderLines(props.msg)}
                    </div>
                </div>
            }
        </>
    )
}
