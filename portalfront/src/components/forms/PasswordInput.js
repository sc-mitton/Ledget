import React from 'react'
import hidePassword from "../../assets/icons/hidePassword.svg"
import showPassword from "../../assets/icons/showPassword.svg"
import { useState } from 'react'

const PasswordInput = (props) => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [visibilityIcon, setVisibilityIcon] = useState(false)

    const handlePasswordInput = (e) => {
        if (e.target.value !== '') {
            setVisibilityIcon(true)
        } else {
            setVisibilityIcon(false)
        }
        props.pwdRef.current = e.target.value
    }

    const VisibilityIcon = () => {
        return (
            visibilityIcon ? (
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
            ) : null
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
                    required
                    onChange={handlePasswordInput}
                />
                <VisibilityIcon />
            </div>
            {props.confirmPassword && (
                <div>
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Confirm Password"
                        ref={props.confirmPwdRef}
                        required
                    />
                </div>
            )}
        </div>
    )
}

export default PasswordInput
