import React from 'react'
import hidePassword from "../../assets/icons/hidePassword.svg"
import showPassword from "../../assets/icons/showPassword.svg"
import { useState } from 'react'

const PasswordInput = (props) => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [visibilityIcon, setVisibilityIcon] = useState(false)

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handlePasswordInput = (event) => {
        if (event.target.value !== '') {
            setVisibilityIcon(true)
        } else {
            setVisibilityIcon(false)
        }
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
                {visibilityIcon ? (
                    passwordVisible ? (
                        <img
                            src={hidePassword}
                            alt="toggle visibility"
                            className="hide-password-icon"
                            onClick={togglePasswordVisibility}
                        />
                    ) : (
                        <img
                            src={showPassword}
                            alt="toggle visibility"
                            className="show-password-icon"
                            onClick={togglePasswordVisibility}
                        />
                    )
                ) : null}
            </div>

            {props.confirmPassword && (
                <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="Confirm Password"
                    required
                />
            )}
        </div>
    )
}

export default PasswordInput
