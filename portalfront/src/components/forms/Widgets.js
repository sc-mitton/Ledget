import React from 'react';

import alert2 from '../../assets/icons/alert2.svg';

export const FormErrorTip = (props) => {
    return (
        <div className='error-tip'>
            <img
                src={alert2}
                className="error-tip-icon"
            />
            <span className="error-tip-msg">{props.msg}</span>
        </div>
    )
}

