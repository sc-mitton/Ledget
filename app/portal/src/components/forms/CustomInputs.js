import React, { forwardRef, useRef } from "react"
import { useState } from 'react'

import './style/CustomInputs.css'
import Select from 'react-select'
import hidePassword from "../../assets/icons/hidePassword.svg"
import showPassword from "../../assets/icons/showPassword.svg"

const Checkbox = forwardRef((props, ref) => {
    const localRef = useRef(null)
    const inputRef = ref || localRef

    const handleLabelKeyDown = (event) => {
        if (event.key === 'Enter') {
            const inputEl = document.getElementById(event.target.htmlFor)
            if (inputEl) {
                inputEl.click()
            }
        }
    }

    return (
        <div className="checkbox-container">
            <svg className="checkbox-symbol">
                <symbol id="check" viewBox="0 0 12 10">
                    <polyline
                        points="1.5 6 4.5 9 10.5 1"
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                    />
                </symbol>
            </svg>
            <input
                className="checkbox-input"
                id={props.id}
                type="checkbox"
                name={props.name}
                defaultChecked={props.defaultChecked}
                onChange={props.onChange}
                ref={inputRef}
                aria-label={props.label}
            />
            <label
                className="checkbox"
                htmlFor={props.id}
                onKeyDown={handleLabelKeyDown}
                tabIndex="0"
                role="checkbox"
                aria-checked={inputRef.current?.checked}
            >
                <span>
                    <svg>
                        <use xlinkHref="#check"></use>
                    </svg>
                </span>
                <span>{props.label}</span>
            </label>
        </div >
    )
})

const CustomSelect = ({ onChange, onBlur, value, ...props }) => {

    let dropDownStyles = {
        container: (baseStyles, state) => ({
            ...baseStyles,
        }),
        valueContainer: (baseStyles, state) => ({
            ...baseStyles,
            appearace: "none",
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "6px",
            paddingLeft: "16px",
            paddingRight: "12px",
            paddingTop: "12px",
            paddingBottom: "36px",
            backgroundColor: "#ebebeb",
            font: "inherit",
            height: "0",
            border: "none",
            border: state.isFocused ? 0 : 0,
            // This line disable the blue border
            boxShadow: state.isFocused ? "0 0 .5px 1.5px var(--light-blue)" : 0,
            '&:hover': {
                border: state.isFocused ? 0 : 0
            }
        }),
        indicatorSeparator: (baseStyles, state) => ({
            ...baseStyles,
            display: "none",
        }),
        indicatorsContainer: (baseStyles, state) => ({
            ...baseStyles,
            paddingLeft: "0",
            paddingRight: "0", // get the padding
        }),
        placeholder: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isFocused ? "#6b9bf6" : "#767676",
        }),
        menu: (baseStyles, state) => ({
            ...baseStyles,
            marginTop: "4px",
            backgroundColor: "var(--button-gray)",
            boxShadow: "0 4px 6px -5px rgba(0, 0, 0, 0.5)",
            borderRadius: "4px",
        }),
        menuList: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "4px",
        }),
        dropdownIndicator: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isFocused ? "#6b9bf6" : "#767676",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            textAlign: "left",
            backgroundColor: state.isSelected
                ? "var(--main-blue)"
                : (state.isFocused ? "#717070" : "var(--button-gray)"),
            borderRadius: "2px",
            padding: "4px",
            width: "100%",
            textAlign: "center",
            cursor: "pointer",
            color: "#f8f8f8"
        }),
        singleValue: (baseStyles, state) => ({
            ...baseStyles,
            color: props.isDisabled ? "var(--input-placeholder)" : "var(--main-text-gray)",
        })
    }

    const handleChange = (selectedOption) => {
        onChange(selectedOption.value)
    }

    const findSelectedOption = (value) => {
        return props.options.find((option) => option.value === value)
    }

    return (
        <Select
            unstyled={true}
            styles={dropDownStyles}
            className='CustomSelect'
            onChange={handleChange}
            onBlur={onBlur}
            value={findSelectedOption(value)}
            {...props}
        />
    )
}

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

// Default values to fill in in case props are not passed
PasswordInput.defaultProps = {
    inputType: 'password',
    name: 'password',
    placeholder: 'Password',
    onBlur: () => { },
    setPwdVisible: () => { },
    pwdVisible: null,
    trigger: (a) => { }
}

export { Checkbox, CustomSelect, PasswordInput }
