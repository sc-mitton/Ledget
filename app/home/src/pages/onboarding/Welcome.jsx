import React, { useState } from 'react'

import './styles/Welcome.css'
import Plus from '@assets/icons/Plus'

const Welcome = () => {

    return (
        <div className="window2 onboarding">
            <h1 className="spaced-header">Getting Started</h1>
            <h3 className="spaced-header2">
                Welcome to Ledget!
            </h3>
            <div className="body">
                We're excited to have you here.
                Let's get started by connecting your financial accounts.
            </div>
            <div className="btn-container action">
                <button
                    className="btn-grn btn3 btn-icon-r"
                    id="connect-account-btn"
                >
                    <span>Link Account</span>
                    <Plus
                        className='animated-stroke'
                        width={'1em'}
                        height={'1em'}
                    />
                </button>
            </div>
        </div>
    )
}

export default Welcome
