import React, { useState } from 'react'

import hidePassword from "../../../assets/icons/hidePassword.svg"
import showPassword from "../../../assets/icons/showPassword.svg"
import './styles/PasswordInput.css'

const PasswordInput = React.forwardRef(({ inputType, ...props }, ref) => {
    const [pwdInput, setPwdInput] = useState(false)
    let [visible, setVisible] = useState(false)
    let { onChange, ...rest } = { onChange: () => { } }

    if (Object.keys(props).includes('register')) {
        const { onChange: registerOnChange, ...registerRest } = props.register(props.name)
        onChange = registerOnChange
        rest = registerRest
    }

    if (props.pwdVisible != null) {
        visible = props.pwdVisible
        setVisible = props.setPwdVisible
    }

    const VisibilityIcon = (props) => {
        // Needs to be set outside the PasswordInput component
        // to prevent rerendering of the icon
        const [showIcon, setShowIcon] = useState(visible)

        return (
            <>
                <img
                    src={!showIcon ? hidePassword : showPassword}
                    alt="toggle visibility"
                    className="password-visibility-icon"
                    onClick={() =>
                        setVisible(!visible) &&
                        setShowIcon(!showIcon) && props.onClick()
                    }
                />
            </>
        )
    }

    return (
        <div className="password-container">
            <div className="password-input">
                <input
                    type={visible ? 'text' : 'password'}
                    name={props.name}
                    placeholder={props.placeholder}
                    ref={ref || null}
                    {...rest}
                    onBlur={(e) => {
                        if (e.target.value) {
                            props.trigger(props.name)
                        }
                    }}
                    onChange={(e) => {
                        e.target.value.length > 0 ? setPwdInput(true) : setPwdInput(false)
                        onChange(e)
                    }}
                />
                {pwdInput && inputType != 'confirm-password' && < VisibilityIcon />}
            </div>
        </div>
    )
})

PasswordInput.defaultProps = {
    inputType: 'password',
    name: 'password',
    placeholder: 'Password',
    onBlur: () => { },
    setPwdVisible: () => { },
    pwdVisible: null,
    trigger: (a) => { }
}

export default PasswordInput
