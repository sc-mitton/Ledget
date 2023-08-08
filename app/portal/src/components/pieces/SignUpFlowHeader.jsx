import React from 'react'

import './pieces.css'
import logo from "@assets/images/logo.svg"

function SignUpFlowHeader() {
    return (
        <div className="signup-container-header">
            <div>
                <img src={logo} alt="Ledget" />
            </div>
        </div>
    )
}

export default SignUpFlowHeader
