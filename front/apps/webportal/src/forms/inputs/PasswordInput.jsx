import React, { useEffect, useState } from 'react'

import { VisibilityIcon } from "@assets/icons"
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
                {pwdInput && inputType != 'confirm-password' &&
                    < VisibilityIcon
                        mode={visible}
                        onClick={() => setVisible(!visible)}
                    />}
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
