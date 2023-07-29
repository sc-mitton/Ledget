import React from 'react'

import './styles/Errors.css'
import alert2 from '@assets/icons/alert2.svg'

export const FormErrorTip = (props) => {
    return (
        <div className='error-tip'>
            <img
                src={alert2}
                className="error-tip-icon"
                alt="Error"
            />
            {props.msg && <span className="error-tip-msg">{props.msg}</span>}
        </div>
    )
}

export const FormError = (props) => {
    const renderLines = (text) => {
        const lines = text.split('\n')
        return lines.map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>)
    }

    return (
        <div className="error-container">
            <div className="form-error">
                <img src={alert2} className="error-icon" />
                {renderLines(props.msg)}
            </div>
        </div>
    )
}
