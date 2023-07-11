import React from 'react'

import logo from "../../assets/images/logo.svg"

function SignUpFlowHeader({ step, steps }) {
    return (
        <div className="signup-container-header">
            <div>
                <img src={logo} alt="Ledget" />
            </div>
            {steps > 0 &&
                <div className="signup-steps-container">
                    <span>Step {step} of {steps}</span>
                </div>
            }
        </div>
    )
}

export default SignUpFlowHeader
