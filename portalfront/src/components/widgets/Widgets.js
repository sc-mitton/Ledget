import React from 'react'

import alert2 from '../../assets/icons/alert2.svg'
import "./widgets.css"

export const FormErrorTip = (props) => {
    return (
        <div className='error-tip'>
            <img
                src={alert2}
                className="error-tip-icon"
            />
            {props.msg && <span className="error-tip-msg">{props.msg}</span>}
        </div>
    )
}

export const LoadingRing = () => {
    return (
        <>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </>
    )
}
