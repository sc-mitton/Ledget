import React from 'react'

import SuccessIcon from '@assets/icons/SuccessIcon'
import './style/SuccessWindow.css'

const SuccessWindow = () => {

    return (
        <div className="radial-fill-window">
            <div>
                <SuccessIcon width={'4em'} height={'4em'} fill={'var(--white-text)'} />
                <h1>Success!</h1>
                <div>
                    <span>We've sent you an email</span>
                    <br />
                    <span>confirming your subscription.</span>
                </div>
            </div>
        </div>
    )
}

export default SuccessWindow
