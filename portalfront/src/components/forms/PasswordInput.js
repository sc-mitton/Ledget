import React from 'react'
import hidePassword from "../../assets/icons/hidePassword.svg"
import showPassword from "../../assets/icons/showPassword.svg"
import { useState, useEffect, useRef } from 'react'

const PasswordInput = (props) => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [pwdInput, setPwdInput] = useState('')
    const { confirmPassword } = props

    const pwdRef = props.pwdRef
    const confirmPwdRef = props.confirmPwdRef
    // errRef is in the props

    const handlePasswordInput = (e) => {
        if (e.target.value !== '') {
            setPwdInput(true)
        } else {
            setPwdInput(false)
        }
    }

    const VisibilityIcon = () => {
        return (
            passwordVisible ? (
                <img
                    src={hidePassword}
                    alt="toggle visibility"
                    className="hide-password-icon"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                />
            ) : (
                <img
                    src={showPassword}
                    alt="toggle visibility"
                    className="show-password-icon"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                />
            )
        )
    }

    return (
        <div className="password-container">
            <div className="password-input">
                <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Password"
                    ref={pwdRef}
                    onChange={handlePasswordInput}
                    required
                />
                {pwdInput && <VisibilityIcon />}
            </div>
            {confirmPassword && (
                <div className="password-input confirm">
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Confirm Password"
                        ref={confirmPwdRef}
                        required
                    />
                </div>
            )}
        </div>
    )
}

PasswordInput.defaultProps = {
    confirmPassword: false
}

export default PasswordInput
